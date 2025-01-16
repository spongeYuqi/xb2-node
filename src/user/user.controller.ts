//资源接口
import { Request, Response, NextFunction } from "express";
import _ from 'lodash';
import { UserModel } from "./user.model";
import * as userService from './user.service';//导入整个模块，而非它的具体的createUser，注意区别！所以后面await要.createUser

/**
 * 创建用户（处理器）
 */
export const store = async (
    req: Request,
    res: Response,
    nex: NextFunction//最后一个参数不用加,
) => {
    
    //准备数据
    const {name,password} = req.body;
   
    //创建用户
    try {
        const data = await userService.createUser({name, password});//一个大参数，因为service是一个占位符
        res.status(201).send(data);
    } catch (error) {
        nex(error);
    }

};

/**
 * 用户账户
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
    // 准备数据
    const { userId } = request.params;

    // 调取用户
    try {
      const user = await userService.getUserById(parseInt(userId, 10));
  
      if (!user) {
        return next(new Error('USER_NOT_FOUND'));
      }
  
      // 做出响应
      response.send(user);
    } catch (error) {
      next(error);
    }
};

/**
 * 更新用户
 */
export const update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    // 准备数据
    const { id } = request.user;
    const userData = _.pick(request.body.update, ['name', 'password']);//从request.body.update挑选出['name', 'password']
  
    // 更新用户
    try {
      const data = await userService.updateUser(id, userData);
  
      // 做出响应
      response.send(data);
    } catch (error) {
      next(error);
    }
  };