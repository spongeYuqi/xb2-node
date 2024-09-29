import { Request, Response, NextFunction } from "express";
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';//验证密码

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
    const matched = await bcrypt.compare(password,user.password);//输入密码与数据仓库密码比对
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

    //下一步
    next();//使请求继续被其他中间件和接口(路由)处理器处理，否则卡住
}
