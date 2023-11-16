import { Document, Model } from "mongoose";

export interface IAddress extends Document {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
}