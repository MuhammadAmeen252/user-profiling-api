import { NextFunction } from "express";
import { IResponse, IRequest } from "../types";

export const customResponse = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
): void => {
  res.sendResponse = (data: any, error: any, status = 200, message: string) => {
    if (error) {
      res.status(status).json({
        success: false,
        error: error,
      });
    } else {
      res.status(status).json({
        success: true,
        data: data,
        message
      });
    }
  };
  next();
};
