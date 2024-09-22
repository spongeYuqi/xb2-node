import dotenv from 'dotenv';

dotenv.config();//此方法默认载入.env的文件定义的环境变量

/**
 * 应用配置
 */
export const { APP_PORT } = process.env;