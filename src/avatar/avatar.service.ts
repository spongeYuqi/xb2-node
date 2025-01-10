import { connection } from "../app/database/mysql";
import { AvatarModel } from "./avatar.model";

/**
 * 保存头像文件信息
 */
export const createAvatar = async (avatar: AvatarModel) => {
    //准备查询
    const statement = `
        INSERT INTO avatar
        SET ?
`


//执行查询
const [data] = await connection.promise().query(statement, avatar);

//提供数据
return data;
};

/**
 * 按用户ID查找头像
 */
export const findAvatarByUserId = async (userId: number) => {
    //准备查询
    const statement =`
    SELECT *
    FROM avatar
    WHERE userId = ?
    ORDER BY avatar.id DESC
    LIMIT 1
    `;

    //执行查询
    const [data] = await connection.promise().query(statement,userId);

    //提供数据
    console.log('data:',data);
    console.log('data[0]:',data[0]);
    return data[0];
    /*{data[0]类似
  "id": 1,
  "mimetype": "image/jpeg",
  "filename": "user123-avatar.jpg",
  "size": 50000,
  "userId": "2023-10-01T12:34:56Z"
    }*/
}
