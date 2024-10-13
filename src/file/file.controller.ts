import path from 'path';
import fs from 'fs';
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
      ...request.fileMetaData,//动态添加属性??
      
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

    //要提供的图像尺寸
    const { size } = request.query;

     // 文件名与目录
     let filename = file.filename;
     let root = 'uploads';
     let resized = 'resized';
 
     if (size) {//判断请求地址URL包含size查询符
       // 可用的图像尺寸
       const imageSizes = ['large', 'medium', 'thumbnail'];
 
       // 检查文件尺寸是否可用
       if (!imageSizes.some(item => item == size)) {
         throw new Error('FILE_NOT_FOUND');
       }
 
       // 检查文件是否存在
       const fileExist = fs.existsSync(
         path.join(root, resized, `${filename}-${size}`),
       );
 
       // 设备文件名与目录
       if (fileExist) {
         filename = `${filename}-${size}`;
         root = path.join(root, resized);//文件位于 uploads 目录下resized
       }
     }

    // 做出响应
    response.sendFile(filename, {//发送指定路径下的文件到客户端,文件位于 uploads 目录下resized
      root,
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 文件信息
 */
export const metadata = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 文件 ID
  const { fileId } = request.params;

  try {
    // 查询文件数据
    const file = await findFileById(parseInt(fileId, 10));

    // 准备响应数据
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};