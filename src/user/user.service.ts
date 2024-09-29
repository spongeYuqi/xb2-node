//服务方法
import { connection } from "../app/database/mysql";
import { UserModel } from "./user.model";


/**
 * 创建用户
 */
export const createUser =async (user:UserModel) => {
    //准备查询
    const statement =`
        INSERT INTO user
        SET ?
    `;
    //执行查询
    const [data] = await connection.promise().query(statement,user);

    //提供数据
    return data;
};



/**
 * 按用户名查找用户
 */

// export const getUserByName =async (name:string) => {
//     //准备查询
//     const statement =`
//         SELECT id,name
//         FROM user
//         WHERE name = ?
//     `;

//     //执行查询
//     const [data] = await connection.promise().query(statement,name);

//     //提供数据
//     return data[0];//设计用户表时，规定不重名，所以返回第一个就行
// };

//interface 是一种定义类型结构的方法，定义了一个接口 GetUserOptions，可选属性 password，其类型为布尔值
interface GetUserOptions {
    password?:boolean;
}

export const getUserByName =async (
    name:string,
    options:GetUserOptions ={},//默认空白值
) => {
    //准备选项
    const { password } = options;

    //准备查询
    const statement =`
        SELECT 
            id,
            name
            ${password ? ', password' : ''}
        FROM user
        WHERE name = ?
    `;//使用 ${} 插入变量或表达式的值，根据 password 的值决定是否在查询结果中包含 password 字段

    //执行查询
    const [data] = await connection.promise().query(statement,name);

    //提供数据
    return data[0];//设计用户表时，规定不重名，所以返回第一个就行
};
