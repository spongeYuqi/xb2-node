//服务方法
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';


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
