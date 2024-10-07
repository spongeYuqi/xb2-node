import { Request, Response, NextFunction, response } from "express";
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';//验证密码
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from "../app/app.config";
import { TokenPayload } from "./auth.interface";
import { possess } from "./auth.service";
import { parseInt } from "lodash";




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


/**
 * 访问控制
 */
interface AccessControlOptions {
    possession?: boolean;
}//这个属性用来指示是否需要检查资源的所有权。

export const accessControl = (options: AccessControlOptions) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        console.log('✨访问控制');

        //解构选项
        const { possession } = options;

        //当前用户ID
        const { id:userId } = req.user;

        //放行管理员
        if(userId == 1) {console.log('我是超级管理员');return next(); }//如果用户的 Id 是 1（假设这是管理员的 Id），则直接调用 next() 放行请求

        //准备资源
        const resourceIdParam = Object.keys(req.params)[0];//req.params 是一个对象，包含了请求 URL (/books/123）中的路径参数。req.params 将包含 { bookId: '123' }，Object.keys() 方法返回一个数组，其中包含对象的所有可枚举属性的键名['bookId']
        const resourceType = resourceIdParam.replace('Id','');//去除 resourceIdParam 中的 'Id' 后缀,目的是为了从资源 ID 的键名中提取出资源的类型名称
        const resourceId = parseInt(req.params[resourceIdParam], 10);//如果 resourceIdParam 是 'bookId'，并且 req.params 中的 bookId 值为 '123'，那么 parseInt(req.params.bookId, 10) 的结果将是 123

        //检查资源拥有权(如果 possession 为 true，则调用 possess 函数来检查当前用户是否拥有该资源)
        if (possession) {
            try {
                const ownResouce = await possess({ resourceId, resourceType, userId });
                console.log(ownResouce);
                if (!ownResouce) {
                    return next (new Error('USER_DOES_NOT_OWN_RESOURCE'));
                }
            } catch (error) {
                return next(error);
                
            }
        }

        //下一步
        next();
    };
};