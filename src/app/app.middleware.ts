import { error } from "console";
import { Request, Response, NextFunction } from "express";


/**
 * 输出请求地址
 */
export const requestUrl = (
    req: Request,
    res: Response,
    nex: NextFunction
 ) => {
    console.log(req.url);//输出请求地址
    nex();//使请求继续被其他中间件和接口处理器处理，否则卡住
}


/**
 * 异常处理器也是中间件
 */
export const defaultErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    nex: NextFunction
) => {
    let statusCode: number, message: string;

    /**
     * 处理异常
     */
    switch (error.message) {
        default:
            statusCode = 500;
            message = '服务暂时出了点问题 ~~';
            break;
    }

    res.status(statusCode).send({message});
}