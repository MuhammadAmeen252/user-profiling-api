import { IRequest, IResponse, INextFunction } from "../types";

export const errorHandler = (error: any, req: IRequest, res: IResponse, next: INextFunction) => {
    res.sendResponse(
        null,
        {
            message: error.message,
        },
        error.status || 500
    )
    next();
}