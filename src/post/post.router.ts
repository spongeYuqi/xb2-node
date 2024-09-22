//定义接口
import express from "express";
//导入所有post.controller导出的东西,并取名as
import * as postController from './post.controller';
//导入中间件
import { requestUrl } from "../app/app.middleware";//不能写src/app/app.middleware

const router = express.Router();

/**
 * 内容列表接口   地址，处理器
 */
router.get('/posts',requestUrl,postController.index);//在控制台输出，在服务器输出




/**
 * 导出路由,默认导出
 */
export default router;