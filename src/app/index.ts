//导入express包，import 名字随便，from 要准确
// import { Express } from "express";不可以
//导入了 Express 框架。Express 是一个用于构建 Web 应用程序的框架，提供了大量的功能来简化 HTTP 服务器的开发。
import express from "express";

//导入router  -> router-> controller-> service的data
import postRouter from '../post/post.router';

//导入err
import { defaultErrorHandler } from "./app.middleware";

//导入userRouter
import userRouter from '../user/user.router';

//导入authRouter
import authRouter from '../auth/auth.router';

/**
 * 创建应用,名字app
 */
//建了一个新的 Express 应用实例。app 对象是 Express 提供的主要接口，用于定义路由、中间件和其他配置
const app = express();


/**
 * 处理JSON  全局范围使用express.json()中间件
app.use 是 Express.js 中的一个方法，用于注册中间件,express.json() 是一个内置的中间件函数，用于解析请求体中的 JSON 数据
 */
app.use(express.json());

/**
 * 配置app去使用定义的接口,这样应用就包含postRouter定义的接口了
 */
app.use(postRouter,userRouter,authRouter);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);


/**
 * 导出应用
 */
export default app;
//这样其他模块可以通过 import 语法来使用这个应用程序实例。