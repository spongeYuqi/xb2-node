import { Request, Response, NextFunction } from "express";
import multer from 'multer';

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
