import { Request, Response, NextFunction } from "express";
import _ from 'lodash';
import { createFile, findFileById } from "./file.service";

/**
 * 上传文件
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // console.log(request.file);
  // response.sendStatus(200);


  //当前用户 取名为userId
  const {id: userId} = request.user;

  //所属内容
  const {post: postIdNumber} = request.query;//显示为string类型
  const postId = Number(postIdNumber);//转换类型

  //文件信息
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);


  try {
    // 保存文件信息
    const data = await createFile({
      ...fileInfo,
      userId,
      postId,
    });

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }

};



/**
 * 文件服务(查询)
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 从地址参数里得到文件 ID
  const { fileId } = request.params;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));//得到的就是个文件信息

    // 做出响应
    response.sendFile(file.filename, {//发送指定路径下的文件到客户端,文件位于 uploads 目录下
      root: 'uploads',
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};