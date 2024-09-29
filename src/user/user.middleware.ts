//中间件
import { Request, Response, NextFunction } from "express";
import * as userService from './user.service';
import bcrypt from 'bcrypt';

/**
 * 验证用户数据
 */
export const validateUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
 ) => {
    console.log("👮‍♂️验证用户数据");

    //准备数据
    const { name, password} = req.body;

    //验证必填数据
    if (!name) return next(new Error('NAME_IS_REQUIRED'));
    if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

    //验证用户名
    const user = await userService.getUserByName(name);
    if (user) return next(new Error('USER_ALREADY_EXIST'));

    //下一步
    next();//使请求继续被其他中间件和接口(路由)处理器处理，否则卡住
}


/**
 * HASH密码
 */
export const hashPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
 ) => {
    //准备数据
    const {password} = req.body;

    //HASH 密码
    req.body.password = await bcrypt.hash(password,10);//hash强度10
   
    
    //下一步
    next();//使请求继续被其他中间件和接口(路由)处理器处理，否则卡住
};