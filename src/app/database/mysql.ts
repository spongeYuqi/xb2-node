//引入 mysql2 库,mysql2 是一个用于连接 MySQL 数据库的库
import mysql from 'mysql2';
import {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
} from '../app.config';//   ../../app/app.config


/**
 * 创建数据服务链接(数据库连接)并导出   host、port...mysql2库约定俗成的键名
 */
export const connection = mysql.createConnection(
    {
        host: MYSQL_HOST,
        port: parseInt(MYSQL_PORT,10),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    }
);