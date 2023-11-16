import { Document, Model } from "mongoose";
import { IAddress } from "./address";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profileImg?: string;
  status?: 'Active' | 'Deactive';
  userType?: "ADMIN" | "CLIENT";
  passwordResetToken?: {
    token: string;
    date: Date;
  };
  addresses?:[IAddress],
  emailVerificationToken?: {
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
  generateEmailVerificationCode?: () => void;
}

export interface IUserModel extends Model<IUser> {
  findByCredientials(email: string, password: string): Promise<IUser | null>;
}
