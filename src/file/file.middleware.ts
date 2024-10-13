import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';

/**
 * 创建一个Multer
 */
const fileUpload = multer({
    dest: 'uploads/',//上传文件存储位置
});

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');//上传文件的表单字段名为file


/**
 * 文件处理器
 */
export const fileProcessor = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    // 文件路径
    const { path } = request.file;
  
    let image: Jimp;//设置为Jimp类型
  
    try {
      // 读取图像文件
      image = await Jimp.read(path);
    } catch (error) {
      return next(error);
    }
  
    console.log(image);

    // 准备文件数据
    const { imageSize, tags } = image['_exif'];
    console.log('imageSize:\n',imageSize);

    // 在请求中添加文件数据
    request.fileMetaData = {
      width: imageSize.width,
      height: imageSize.height,
      metadata: JSON.stringify(tags),
    };
  
    // 调整图像尺寸
    imageResizer(image, request.file);
  
    // 下一步
    next();
  };