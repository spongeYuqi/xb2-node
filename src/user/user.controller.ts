//资源接口
import { Request, Response, NextFunction } from "express";
import { UserModel } from "./user.model";
import * as userService from './user.service';//导入整个模块，而非它的具体的createUser，注意区别！所以后面await要.createUser

/**
 * 创建用户（处理器）
 */
export const store = async (
    req: Request,
    res: Response,
    nex: NextFunction//最后一个参数不用加,
) => {
    
    //准备数据
    const {name,password} = req.body;
   
    //创建用户
    try {
        const data = await userService.createUser({name, password});//一个大参数，因为service是一个占位符
        res.status(201).send(data);
    } catch (error) {
        nex(error);
    }

};
