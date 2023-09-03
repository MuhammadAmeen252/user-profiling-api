import { User } from "../models";
import { IResponse, IRequest, INextFunction, IParams, IUser } from "../types";
import { sendAccountVerificationMail, statusCodes } from "../utils";

export const registerUser = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  const user = new User(req.body);
  try {
    const updates = Object.keys(req.body);
    if (updates.length === 0) {
      return res.sendResponse(
        null,
        { message: "Please enter valid user data!x" },
        statusCodes.CONFLICT_DATA
      );
    }
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.sendResponse(
        null,
        { message: "Email already exists!" },
        statusCodes.CONFLICT_DATA
      );
    }
    //Comment this condition to add admin
    if (req.body.userType === "ADMIN" && !req?.user && !(req?.user?.userType === "ADMIN")) {
      throw new Error("Only admin can add a new admin!")
    }
    user.generateEmailVerificationCode();
    sendAccountVerificationMail(user.email, user.name, user.emailVerificationToken);
    await user.save();
    const token = await user.generateAuthToken();
    res.sendResponse({ user, token }, null, statusCodes.CREATED);
  } catch (err) {
    err.status = statusCodes.NOT_FOUND;
    next(err);
  }
};

export const loginUser = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const user = await User.findByCredientials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.sendResponse({ user, token }, null, statusCodes.ACCEPTED);
  } catch (e) {
    e.status = statusCodes.UNAUTHORIZED;
    next(e);
  }
};

export const logoutUser = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokens) => {
      return tokens.token !== req.token;
    });
    await req.user.save();
    res.sendResponse({}, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.UNAUTHORIZED;
    next(e);
  }
};

export const forgetAccountPassword = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error(
        "No user with this email exists! Please enter valid email."
      );
    }
    //Generate and set password reset token
    user.generatePasswordReset();
    await user.save();
    //reset password link

    //send reset password link to user via. email
    res.sendResponse({}, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};

export const verifyPasswordResetToken = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const user = await User.findOne({
      "passwordResetToken.token": req.params.token,
      "passwordResetToken.date": { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Password reset token is invalid or has expired.");
    }

    //Set the new password
    user.password = req.body.password;
    user.passwordResetToken.token = undefined;
    user.passwordResetToken.date = undefined;
    //logout from all devices
    user.tokens = [];
    await user.save();

    res.sendResponse({}, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};

export const verifyEmailToken = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const user = await User.findOne({
      "emailVerificationToken.token": req.params.token,
      "emailVerificationToken.date": { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Email verification token is invalid or has expired.");
    }
    user.isAccountVerified = true;
    user.emailVerificationToken.token = undefined;
    user.emailVerificationToken.date = undefined;
    await user.save();

    res.sendResponse({}, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};

export const getUserInfoById = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      throw new Error("No user with this id fround.");
    }
    res.sendResponse({ user }, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};

export const getUsers = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const {
      page,
      limit,
      search,
      sortBy,
      isVerified,
      userType
    }: IParams = req.query as {
      page: string;
      limit: string;
      search: string;
      sortBy: string;
      isVerified: string;
      userType: string;
    };

    const baseQuery: any = {};

    if(search){
      baseQuery.name = { $regex: search, $options: 'i' };
    }

    if(isVerified === "1"){
      baseQuery.isAccountVerified = true;
    }

    if(userType){
      baseQuery.userType = userType;
    }
    const sortedBy: any = sortBy ? {[sortBy]: -1} : {createdAt: -1};
    const totalRecords = await User.countDocuments(baseQuery);

    // Getting filtered and paginated records
    const pageNumber = parseInt(page || "0", 10);
    const limitNumber = parseInt(limit || "20", 10);
    const users = await User.find(baseQuery)
      .sort(sortedBy)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber);

    res.sendResponse({
      recordsTotal: totalRecords,
      recordsFiltered: users.length,
      data: users
    }
    , null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};

export const updateProfile = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const updates = Object.keys(req.body);
    if (updates.length === 0) {
      return res.sendResponse(
        null,
        { message: "Please eneter valid keys!" },
        statusCodes.CONFLICT_DATA
      );
    }
    const notAllowedUpdated = [
      "userType",
      "passwordResetToken",
      "status",
      "isAccountVerified",
    ];
    const isNotalidOperation = updates.every((update) =>
      notAllowedUpdated.includes(update)
    );
    if (isNotalidOperation || updates.length == 0) {
      return res.sendResponse(
        null,
        { message: "Enter valid keys!" },
        statusCodes.CONFLICT_DATA
      );
    }
    const user = req.user;
    if(req.body.email){
      const existingUser = await User.find({ email: req.body.email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.sendResponse(
          null,
          { message: "Email already exists!" },
          statusCodes.CONFLICT_DATA
        );
      }
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.sendResponse({ user }, null, statusCodes.OK);
  } catch (e) {
    e.status = statusCodes.NOT_FOUND;
    next(e);
  }
};