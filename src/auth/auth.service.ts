//服务方法
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';
import { connection } from '../app/database/mysql';


/**
 * 签发信息
 */
interface SignTokenOptions {
    payload?:any;
}

export const SignToken = (options:SignTokenOptions) => {
    //准备选项
    const {payload} = options;

    //签发JWT（使用私钥对 payload 进行签名，生成 JWT 令牌）
    const token = jwt.sign(payload,PRIVATE_KEY,{algorithm:'RS256'});//数据、密钥、加密算法



    //提供JWT
    return token;
}




/**
 * 检查用户是否拥有指定资源
 */
interface PossessOptions {
    resourceId: number;//目标内容的id
    resourceType: string;//目标的表
    userId: number;//修改用户的id
}
 //修改用户的id要与被修改表的id（内容的id）的内容的userid一致才有权限

export const possess = async (options:PossessOptions) => {
    //准备选项
    const {resourceId, resourceType, userId} = options;

    //准备查询
    const statement =`
        SELECT COUNT(${resourceType}.id) as count
        FROM ${resourceType}
        WHERE ${resourceType}.id = ? AND userId = ?
    `;
    //resourceType 表中的 id 列计数命名为count
    //${resourceType} 是一个动态变量，代表需要查询的表名,由 resourceType 变量决定
    //查询 resourceType 表中 id 列等于某个值的行  省略了后面的.userID   
    //修改用户的id要与被修改表的id（内容的id）的内容的userid一致才有权限

    //检查拥有权
    const [data] = await connection
    .promise()
    .query(statement,[resourceId,userId]);

    //提供检查结果
    return data[0].count ? true : false;


};