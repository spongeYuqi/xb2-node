//定义接口
import express from "express";
//导入所有post.controller导出的东西,并取名as  源头是post.service  return的data
import * as postController from './post.controller';
//导入中间件
import { requestUrl } from "../app/app.middleware";//不能写src/app/app.middleware
import { authGuard, accessControl } from "../auth/auth.middleware";




const router = express.Router();

/**
 * 内容列表接口   路径，中间件函数，路由处理函数
 */
router.get('/posts',requestUrl,postController.index);//在控制台输出，在服务器输出
//客户端发送 GET 请求到 /posts 时将触发此路由处理函数
//requestUrl 是一个中间件函数  输出请求地址 /posts
//postController.index 是一个路由处理函数，用于处理 /posts 路径的 GET 请求。这个函数通常包含了处理请求的具体逻辑，并生成响应
//.index是指postController的一个分支模块


/**
 * 创建内容
 */
router.post('/posts',authGuard,postController.store);


/**
 * 更新内容  请求要求用的HTTP方法是patch
 */
router.patch(
    '/posts/:postI',
    authGuard,
    accessControl({ possession:true}),
    postController.update,
);


/**
 * 删除内容
 */router.delete(
    '/posts/:postI',
    authGuard,
    accessControl({ possession:true}),
    postController.destroy,
);


/**
 * 导出路由,默认导出
 */
export default router;