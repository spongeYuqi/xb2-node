//导入express包，import 名字随便，from 要准确
// import { Express } from "express";不可以
import express from "express";

//导入router
import postRouter from '../post/post.router';

//导入err
import { defaultErrorHandler } from "./app.middleware";


/**
 * 创建应用,名字app
 */
const app = express();


/**
 * 处理JSON  全局范围使用express.json()中间件
 */
app.use(express.json());

/**
 * 配置app去使用定义的接口,这样应用就包含postRouter定义的接口了
 */
app.use(postRouter);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);


/**
 * 导出应用
 */
export default app;