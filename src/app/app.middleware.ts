import { error } from "console";
import { Request, Response, NextFunction } from "express";


/**
 * 输出请求地址
 */
//这个中间件函数的作用是在请求到达下一个中间件或路由处理函数之前，打印请求的 URL，并调用 next() 函数继续执行后续的中间件或路由处理函数
export const requestUrl = (
    req: Request,
    res: Response,
    nex: NextFunction
 ) => {
    console.log(req.url);//记录请求地址
    nex();//使请求继续被其他中间件和接口(路由)处理器处理，否则卡住
}


/**
 * 异常处理器也是中间件
 */
//用于处理错误的中间件函数，通常称为全局错误处理中间件。这个函数的作用是在 Express 应用中捕获未处理的错误，并发送一个统一格式的错误响应给客户端
export const defaultErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    nex: NextFunction
) => {
    if(error.message) {
        console.log('✨',error.message);
    }



    let statusCode: number, message: string;

    /**
     * 处理异常
     */
    switch (error.message) {
        case 'USER_ALREADY_EXIST':
            statusCode = 409;//conflict
            message = '用户已存在';
            break;
        case 'NAME_IS_REQUIRED':
            statusCode = 400;
            message = '请提供用户名';
            break;
        case 'PASSWORD_IS_REQUIRED':
            statusCode = 400;
            message = '请提供用户密码';
            break;
        case 'USER_DOES_NOT_EXIST':
            statusCode = 400;
            message = '用户不存在';
            break;
        case 'PASSWORD_DOES_NOT_MATCH':
            statusCode = 400;
            message = '密码错误';
            break;
        case 'UNAUTHORIZED':
            statusCode = 401;
            message = '请先登录';
            break;
        case 'USER_DOES_NOT_OWN_RESOURCE':
            statusCode = 403;//forbid
            message = '您不能处理这个内容';
            break;
        //先后顺序其实由if判断的先后触发顺序决定

        default:
            statusCode = 500;
            message = '服务暂时出了点问题 ~~';
            break;
    }

    res.status(statusCode).send({message});
}
//使用 res.status(statusCode) 设置响应的状态码，并使用 res.send 发送一个包含错误消息的对象 {message} 给客户端