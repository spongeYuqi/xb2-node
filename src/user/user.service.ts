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
 * 查找用户
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

export const getUser = (condition: string) => {
    return async (
        param: string | number,
        options:GetUserOptions ={},//默认空白值
    ) => {
        //准备选项
        const { password } = options;
    
        //准备查询
        const statement =`
            SELECT 
                user.id,
                user.name,
                IF (
                  COUNT(avatar.id), 1, NULL    
                ) AS avatar
                ${password ? ', password' : ''}
            FROM 
              user
            LEFT JOIN avatar
              ON avatar.userId = user.id
            WHERE 
              ${condition} = ?
        `;//使用 ${} 插入变量或表达式的值，根据 password 的值决定是否在查询结果中包含 password 字段
    
        //执行查询
        const [data] = await connection.promise().query(statement,param);
        //console.log(data[0]);
        //console.log(data);
        //提供数据
        return data[0].id ? data[0] : null;//设计用户表时，规定不重名，所以返回第一个就行
        
    };
};

/**
 * 按用户名获取用户
 */
export const getUserByName = getUser('user.name');

/**
 * 按用户ID获取用户
 */
export const getUserById = getUser('user.id');

/**
 * 更新用户
 */
export const updateUser = async (userId: number, userData: UserModel) => {
    // 准备查询
    const statement = `
      UPDATE user
      SET ?
      WHERE user.id = ?
    `;
  
    // SQL 参数
    const params = [userData, userId];
  
    // 执行查询
    const [data] = await connection.promise().query(statement, params);
  
    // 提供数据
    return data;
  };

/**
 * 删除用户
 */
export const deleteUser = async (userId: number) => {
    // 准备查询
    const statement = `
      DELETE FROM user
      WHERE id = ?
    `;
  
    // 执行查询
    const [data] = await connection.promise().query(statement, userId);
  
    // 提供数据
    return data;
  };