import { Schema, model } from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, IUserModel } from "../types";
import { generateRandomCode } from "../utils";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    userType: {
      type: String,
      default: "CLIENT",
      enum: ["CLIENT", "ADMIN"],
    },
    passwordResetToken: {
      token: { type: String },
      date: { type: Date },
    },
    emailVerificationToken: {
      token: { type: String },
      date: { type: Date },
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Deactive"],
    },
    isAccountVerified:{
        type: Boolean,
        default: false
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  const user: IUser = this;
  const saltRounds = 8;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  let token = "";
  if(user.userType === "CLIENT"){
    token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_CLIENT_CODE,
      {
        expiresIn: process.env.JWT_CLIENT_EXPIRY,
      }
    );
  }
  if(user.userType === "ADMIN"){
    token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_ADMIN_CODE,
      {
        expiresIn: process.env.JWT_ADMIN_EXPIRY,
      }
    );
  }
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.updatedAt;
  delete userObject.__v;
  return userObject;
};

UserSchema.statics.findByCredientials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user && !password && !email) {
    throw new Error("Unable to login! Please enter valid email and password! ");
  }
  if (!user) {
    throw new Error("Unable to login! Invalid email!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(" Invalid password Entered!");
  }
  return user;
};

UserSchema.pre<IUser>("validate", function (next) {
  const validationSchema = Joi.object().keys({
    name: Joi.string().required().min(3),
    password: Joi.string().required().min(6),
    email: Joi.string().required().email(),
    userType: Joi.string().valid("CLIENT", "ADMIN").default("CLIENT"),
  });
  const { name, password, email, userType }: IUser = this;
  const user = {
    name,
    password,
    email,
    userType,
  };
  const validationResult = validationSchema.validate(user);
  if (validationResult.error) {
    next(validationResult.error);
  } else {
    next();
  }
});

UserSchema.methods.generatePasswordReset = function () {
  const token: string = generateRandomCode(20);
  this.passwordResetToken = { token, date: Date.now() + 3600000 };
};

UserSchema.methods.generateEmailVerificationCode = function () {
  const token: string = generateRandomCode(20);
  this.emailVerificationToken = { token, date: Date.now() + 3600000 };
};

UserSchema.index({ email: 1 }, { unique: true });
const User: IUserModel = model<IUser, IUserModel>("user", UserSchema);
export { User };
