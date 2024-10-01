//密钥公钥转换格式
const fs = require('fs');//导入nodejs的file system
const path = require('path');//组织文件路径


/**
 * 读取密钥文件
 */
const privatekey = fs.readFileSync(path.join('config','private.key'));//path.join 是 Node.js 的 path 模块中的一个方法，用于连接一个或多个路径段来创建一个完整的路径字符串。它会根据当前操作系统（Windows 或 Unix-like 系统）的路径约定来规范化路径字符串。
const publickey = fs.readFileSync(path.join('config','public.key'));


/**
 * 转换成Base64格式
 */
const privatekeyBase64 = Buffer.from(privatekey).toString('base64');//在 Node.js 中，文件读取通常返回的是二进制数据，而 Buffer 提供了一种方式来操作转换这些二进制数据。
const publickeyBase64 = Buffer.from(publickey).toString('base64');


/**
 * 输出转换结果
 */
console.log('\nPrivate Key:');
console.log(privatekeyBase64);

console.log('\nPublic Key:');
console.log(publickeyBase64);

