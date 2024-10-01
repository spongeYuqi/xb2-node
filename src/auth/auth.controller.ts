//身份验证接口处理器
import { Request, Response, NextFunction } from "express";
//导入令牌
import { SignToken } from "./auth.service"; 


/**
 * 用户登录
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction//最后一个参数不用加,
) => {
    
    //准备数据
    // const {name,password} = req.body;
    
    //作出响应
    // res.send({message:`欢迎回来， ${name}`});

    //准备数据
    const {
        user: { id, name },//validateLoginDa中添加的user,因为router先执行中间件，user已经是存在的
    } = req.body;
    
    //服务器使用用户的 id 和 name 生成 payload
    const payload = { id, name };//上一条语句const出来的

 
    try {
        //签发令牌（使用私钥对 payload 进行签名，生成 JWT 令牌）
        const token = SignToken({ payload });

        //作出响应
        res.send({ id, name, token});
    } catch (error) {
        next(error);
    }
};



/**
 * 验证登录
 */
export const validate = (
    req: Request,
    res: Response,
    next: NextFunction//最后一个参数不用加,
) => {
    console.log(req.user);//因为先经过authGuard中间件拥有了user属性
    res.sendStatus(200);
};
