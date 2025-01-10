import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback} from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';
import { type } from "os";

/**
 * 文件过滤器
 */
export const FileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    //测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);//some测试数组中的元素(type)是否至少有一个满足上传的文件类型file.mimetype，MIME 类型（多用途互联网邮件扩展类型）

    if (allowed) {
      //允许上传
      callback(null,true)//true：接受文件，继续上传过程
    } else {
      //拒绝上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }

  };
};

//文件过滤器实例  将 fileTypes 参数赋值为一个包含特定 MIME 类型的数组
const fileUploadFilter = FileFilter(['image/png','image/jpg','image/jpeg']);


/**
 * 创建一个Multer
 */
const fileUpload = multer({
    dest: 'uploads/',//上传文件存储位置
    fileFilter: fileUploadFilter,//不是FileFilter，那个是自定义过滤函数的名字（也能写成fileFilter），这个是multer自带的
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