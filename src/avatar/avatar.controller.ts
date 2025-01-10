import path from "path";
import fs from 'fs';
import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { createAvatar, findAvatarByUserId } from "./avatar.service";


/**
 * 上传头像
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //当前用户ID
  const { id: userId } = request.user;
  //通常在认证中间件（如 JWT 或会话管理）中，request.user 会被设置为当前登录用户的详细信息，包括用户 ID。

  //头像文件信息
  const fileInfo = _.pick(request.file,['mimetype','filename','size']);
  //使用 Lodash 的 _.pick 方法从 request.file 对象中选择特定属性（mimetype, filename, size），并创建一个新的对象 fileInfo

  //准备头像文件
  const avatar = {
    ...fileInfo,//扩展运算符,数组元素作为独立参数传递给函数
    userId,
  };

  try {
    //保存头像文件
    const data = await createAvatar(avatar);

    ///做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 头像服务
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //用户ID
  const { userId } = request.params;
  //request.params 是 Express.js 和类似 Web 框架中用于访问路由参数的对象。它包含了从 URL 路径中提取的动态部分，这些部分在定义路由时通过冒号 (:) 标记为参数。

  try {
    //查找头像信息
    const avatar = await findAvatarByUserId(parseInt(userId,10));

    if (!avatar) {
        throw new Error('FILE_NOT_FOUND');
    }

    //要提供的头像尺寸
    const { size } = request.query;

    //文件名与目录
    let filename  = avatar.filename;
    let root = path.join('uploads','avatar');
    let resized = 'resized';

    if (size) {
        //可用的头像尺寸
        const imageSizes = ['large','medium','small'];

        //测试可用的头像尺寸
        if (!imageSizes.some(item => item == size)) {
            throw new Error('FILE_NOT_FOUND')
        }

        //检查文件是否存在
        const fileExist = fs.existsSync(
            path.join(root,resized,`${filename}-${size}`)
        );

        if(!fileExist) {
            throw new Error('FILE_NOT_FOUND')
        }

        if(fileExist) {
            filename = `${filename}-${size}`;
            root = path.join(root,resized);
            //path.join(...) 方法：将多个路径片段连接成一个完整的路径。
        }
    }

    //做出响应
    //response.sendFile是 Express.js 中用于发送文件给客户端的方法。
    response.sendFile(filename,{
        root,
        headers: {
            'Content-Type':avatar.mimetype,
        }
    })
  } catch (error) {
    next(error);
  }
};