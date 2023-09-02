import { Request, Response, NextFunction } from "express";
import { IUser } from "./user";
export interface IRequest extends Request {
  user?: IUser;
  file?: any;
  token?: string;
}
export interface IResponse extends Response {
  sendResponse(data: any, error: any, status: number, message?: string): void;
}

export interface INextFunction extends NextFunction {}
