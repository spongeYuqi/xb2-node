//身份验证接口处理器
import { Request, Response, NextFunction } from "express";


/**
 * 用户登录
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction//最后一个参数不用加,
) => {
    
    //准备数据
    const {name,password} = req.body;
   
   //作出响应
   res.send({message:`欢迎回来， ${name}`});

};