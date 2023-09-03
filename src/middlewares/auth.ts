import { IResponse, IRequest, INextFunction } from "../types";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { statusCodes } from "../utils";

export const authAdmin = async(req: IRequest, res: IResponse, next: INextFunction)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_CODE)
        const user = await User.findOne({_id:decoded._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        if(!(user.userType === "ADMIN")){
            throw new Error()
        }
        req.user = user
        req.token=token
        next()
    }
    catch(e){
        e.status = statusCodes.UNAUTHORIZED
        e.message = 'Sorry! You are not authorized as admin.'
        next(e)
    }
}

export const authClient = async(req: IRequest, res: IResponse, next: INextFunction)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_CLIENT_CODE)
        const user = await User.findOne({_id:decoded._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        if(!(user.userType === "CLIENT")){
            throw new Error()
        }
        req.user = user
        req.token=token
        next()
    }
    catch(e){
        e.status = statusCodes.UNAUTHORIZED
        e.message = 'Sorry! You are not authorized.'
        next(e)
    }
}