//接口
import express from 'express';
import * as userController from './user.controller';
import { validateUserData, hashPassword, validateUpdateUserData, } from './user.middleware';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 创建用户
 */
router.post('/users',validateUserData,hashPassword,userController.store);//hashPassword放后面保证有密码

/**
 * 用户账户
 */
router.get('/users/:userId',userController.show);

/**
 * 更新用户
 */
router.patch(
    '/users',
    authGuard,
    validateUpdateUserData,
    userController.update,
);

/**
 * 导出路由
 */
export default router;