import { Request, Response, NextFunction, response } from "express";
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';//验证密码
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from "../app/app.config";
import { TokenPayload } from "./auth.interface";

/** 
 * 验证用户登录
*/
export const validateLoginData = async (
    req: Request,
    res: Response,
    next: NextFunction
 ) => {
    console.log("👮‍♂️验证用户登录数据");

    //准备数据
    const { name, password} = req.body;

    //验证必填数据
    if (!name) return next(new Error('NAME_IS_REQUIRED'));
    if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

    //验证用户名
    const user = await userService.getUserByName(name,{ password:true});
    if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

    //验证密码
    const matched = await bcrypt.compare(password,user.password);//比较用户输入的明文密码 (password) 与存储在数据库中的哈希密码 (user.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));


    //在请求主体里添加 用户
    req.body.user = user;//user.service的getUserByName中SELECT出来的信息


    //下一步
    next();//使请求继续被其他中间件和接口(路由)处理器处理，否则卡住
}



/**
 * 验证用户身份（令牌）
 */
export const authGuard = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('✨Token验证用户身份');

    try {//try中的error交给catch，然后交给defaultErrorHandler

        //提取Authorization
        const authorization = req.header('Authorization');
        if(!authorization) throw new Error();

        //提取JWT令牌
        const token = authorization.replace('Bearer ', '');//将Bearer 替换成空格
        if(!token) throw new Error();

        //验证令牌
        // jwt.verify(token,PUBLIC_KEY,{
        //     algorithms:['RS256'],
        // });
        const decoded = jwt.verify(token,PUBLIC_KEY,{
            algorithms:['RS256'],
        });//包含id,name,iat（签发时间）信息

        //在请求里添加当前用户（types中给req增加了user属性）
        req.user = decoded as TokenPayload;//转换类型看成是TokenPayload


        //下一步
        next();


    } catch (error) {
        next( new Error('UNAUTHORIZED'));
    }
};
