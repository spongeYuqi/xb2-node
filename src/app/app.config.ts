//dotenv 是一个流行的 Node.js 库，用于管理环境变量。它通过读取 .env 文件并将文件中声明的环境变量加载到 process.env 中，使得开发者可以在代码中方便地访问这些环境变量。
//如果你创建了一个 .env 文件但没有使用 dotenv 库来加载这些环境变量，那么这些环境变量不会自动被加载到 process.env 中。.env 文件只是普通的文本文件，它不会自动将内容注入到 process.env 中。
import dotenv from 'dotenv';//导入了 dotenv 库

dotenv.config();//此方法默认载入.env的文件定义的环境变量
//dotenv.config() 是 dotenv 库提供的一个方法，用于加载 .env 文件中的环境变量，并将这些环境变量设置到 process.env 对象中



/**
 * 应用配置
 */
export const { APP_PORT } = process.env;


/**
 * 数据仓库配置
 */
export const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
} = process.env;


/**
 * 密钥配置
 */ 
export let {PRIVATE_KEY,PUBLIC_KEY} =process.env;
PRIVATE_KEY = Buffer.from(PRIVATE_KEY,'base64').toString();//从base64还原  类似a=a+1
PUBLIC_KEY = Buffer.from(PUBLIC_KEY,'base64').toString();
