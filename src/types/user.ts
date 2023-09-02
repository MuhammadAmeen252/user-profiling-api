import { Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profileImg?: string;
  userType?: "ADMIN" | "CLIENT";
  passwordResetToken?: {
    token: string;
    date: Date;
  };
  isAccountVerified?: boolean;
  tokens: {
    token: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken?: () => string;
  generatePasswordReset?: () => void;
}

export interface IUserModel extends Model<IUser> {
  findByCredientials(email: string, password: string): Promise<IUser | null>;
}
