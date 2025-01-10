import path from "path";
import Jimp from "jimp";
import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { FileFilter } from "../file/file.middleware";

/**
 * 文件过滤器//文件过滤器实例  将 fileTypes 参数赋值为一个包含特定 MIME 类型的数组
 */
const avatarUploadFilter = FileFilter(['image/png','image/jpg','image/jpeg']);

/**
 * 创建一个Multer
 */
const avatarUpload = multer({
    dest: 'uploads/avatar',//文件上传位置
    fileFilter: avatarUploadFilter,//文件过滤器
})

/**
 * 文件拦截器
 */
export const avatarInterceptor = avatarUpload.single('avatar');//'avatar' 是表单字段的名称，即上传文件时使用的字段名。

/**
 * 头像处理器
 */
export const avatarProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备文件信息
  const {file} = request;

  //准备文件路径
  const filePath = path.join(file.destination,'resized',file.filename);
  //file.destination 是由 Multer 提供的一个属性，表示文件上传时所存储的目录,这里指'uploads/avatar'
  //子目录名称'resized'
  //file.filename 同样是由 Multer 提供的一个属性，表示上传文件的唯一文件名，包含了文件的基本名称和扩展名（如果有的话）
  

  //处理头像文件
  try {
    //读取文件
    const image = await Jimp.read(file.path);
    //const image = await Jimp.read(file.path); 的作用是将上传的图片文件加载到内存中，创建一个可以操作的 Jimp 实例对象 image。这个步骤是必要的，因为后续所有的图像处理操作（如调整尺寸、应用滤镜等）都是基于这个 Jimp 实例进行的。
    //最后，删除临时文件（file.path）
    //创建临时文件再进行后续操作（如调整图像尺寸）是处理文件上传的一种常见模式，隔离上传文件：将上传文件保存到一个特定的临时目录中，可以避免与应用程序的其他部分产生冲突，减少潜在的安全风险

    //调整尺寸
    image
        .cover(256,256)
        .quality(85)
        .write(`${filePath}-large`);
    image
        .cover(128,128)
        .quality(85)
        .write(`${filePath}-medium`);
    image
        .cover(64,64)
        .quality(85)
        .write(`${filePath}-small`);

  } catch (error) {
    next(error);
  }

  //下一步
  next();
};
