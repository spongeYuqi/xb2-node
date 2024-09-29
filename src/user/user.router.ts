//接口
import express from 'express';
import * as userController from './user.controller';
import { validateUserData, hashPassword } from './user.middleware';

const router = express.Router();

/**
 * 创建用户
 */
router.post('/users',validateUserData,hashPassword,userController.store);//hashPassword放后面保证有密码

/**
 * 导出路由
 */
export default router;