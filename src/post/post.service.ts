//导入数据仓库连接
import { connection } from "../app/database/mysql";


/**
 * 获取内容列表
 */
// export const getPosts = () => {
//     const data = [
//         {
//             content: '明月出天山，苍茫云海间',
//         },
//         {
//             content: '会当凌绝顶，一览众山小',
//         },
//         {
//             content: '日出江花红胜火，春来江水绿如蓝',
//         },
//     ];
//     return data;//此为静态数据
    
// };




/**
 * 获取内容列表
 */
export const getPosts = async () => {
    
    const statement =
        `SELECT * FROM post`//存储 SQL 查询语句  要加单引号        
        ;
    const [data] = await connection.promise().query(statement);//await 关键字用于等待一个 Promise 的解析结果。这意味着在这行代码之前的所有同步操作都会执行完毕，然后这行代码会暂停执行，直到 Promise 解析完成
    //query 方法返回一个包含多个元素的数组，第一个元素通常是查询结果（即数据集）
    //使用数组解构赋值 (const [data] = ...) 可以方便地获取查询结果的第一个元素（即数据集）
    //通过使用 mysql2 库提供的 promise() 方法，可以将数据库连接转换为一个支持 Promise 的对象，这意味着你可以使用 Promise 的相关方法（如 .then()、.catch()）以及 async/await 语法来处理异步操作

    return data;
    
};