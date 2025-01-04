//导入数据仓库连接
import internal from "stream";
import { connection } from "../app/database/mysql";
import { PostModel } from "./post.model";//
import { sqlFragment } from './post.provider';

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
export interface GetPostsOptionsFilter {
    name: string;
    sql?: string;
    param?: string;
}

export interface GetPostsOptionsPagination {
    limit: number;
    offset: number;
}

//问号表示可选
interface GetPostsOptions {
    sort?: string;
    Filter?: GetPostsOptionsFilter;//req.filter已经存在自带
    pagination?: GetPostsOptionsPagination;
}

export const getPosts = async (options:GetPostsOptions) => {
    const { 
        sort, 
        Filter, 
        pagination: { limit, offset }, 
    } = options;

    // sql 参数
    let params: Array<any> = [limit, offset];

    // 设置sql 参数
    if (Filter.param) {
        params = [Filter.param, ...params];
    }
//...params 会将 params 数组中的每个元素展开并依次插入到新数组中

    const statement =
        `SELECT
            post.id,
            post.title,
            post.content,
            ${sqlFragment.user},
            ${sqlFragment.totalComments},
            ${sqlFragment.file},
            ${sqlFragment.tags}
        FROM post
            ${sqlFragment.leftJoinUser}
            ${sqlFragment.leftJoinOneFile } 
            ${sqlFragment.leftJoinTag}
            WHERE ${Filter.sql}
            GROUP BY post.id
            ORDER BY ${sort}
            LIMIT ?
            OFFSET ?`    
        ;
        //亲测可以省略分号，但以后别纠结这些，严谨的！//存储 SQL 查询语句  要加单引号    as user取名（没有FROM user因为有LEFT JOIN user会去搜索这个表）       
        //问号 (?) 是 SQL 查询语句中的占位符，用于参数化查询。这些占位符将被 params 数组中的值替换
        //SQL 语句中只有两个问号，分别对应 LIMIT ? OFFSET ?。这意味着如果 Filter.param 存在，实际上你会有三个参数，而 SQL 中只有两个占位符。这会导致参数数量不匹配的问题
    const [data] = await connection.promise().query(statement, params);//await 关键字用于等待一个 Promise 的解析结果。这意味着在这行代码之前的所有同步操作都会执行完毕，然后这行代码会暂停执行，直到 Promise 解析完成
    //query 方法返回一个包含多个元素的数组，第一个元素通常是查询结果（即数据集）
    //使用数组解构赋值 (const [data] = ...) 可以方便地获取查询结果的第一个元素（即数据集）
    //通过使用 mysql2 库提供的 promise() 方法，可以将数据库连接转换为一个支持 Promise 的对象，这意味着你可以使用 Promise 的相关方法（如 .then()、.catch()）以及 async/await 语法来处理异步操作

    return data;//data[0]只返回第一组
    
};

/**
 * 创建内容  自动添加import
 */
export const creatPost = async (post: PostModel) => {
    //准备查询
    const statement =`
        INSERT INTO post
        SET ?    
    `;//更安全  使用占位符 ? 来代替具体的值，然后在执行查询时传递实际的参数值。
//先指明INSERT到post表格中，再设置要插入的数据


    //执行查询
    const [data] = await connection.promise().query(statement,post);//具体指定问号内容为post，第二个参数用于传递 SQL 语句中的参数值，这是标准用法

    //提供数据
    return data;
};


/**
 * 更新内容
 */
export const updatePost =async (postId:number,post:PostModel) => {
    //准备查询
    const statement =`
        UPDATE post
        SET ?
        WHERE id = ?
    `;
    //执行查询
    const [data] = await connection.promise().query(statement,[post,postId]);//对应两个问号顺序匹配的方式替换占位符的，但是接受参数的顺序是看async (postID:number,post:PostModel)

    //提供数据
    return data;
};


/**
 * 删除内容
 */
export const deletePost =async (postId:number) => {
    //准备查询
    const statement =`
        DELETE FROM post
        WHERE id = ?
    `;
    //执行查询
    const [data] = await connection.promise().query(statement,postId);

    //提供数据
    return data;
};

/**
 * 保存内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
    // 准备查询
    const statement = `
      INSERT INTO post_tag (postId, tagId)
      VALUES(?, ?)
    `;
  
    // 执行查询
    const [data] = await connection.promise().query(statement, [postId, tagId]);
  
    // 提供数据
    return data;
  };
  
  /**
   * 检查内容标签
   */
  export const postHasTag = async (postId: number, tagId: number) => {
    // 准备查询
    const statement = `
      SELECT * FROM post_tag
      WHERE postId=? AND tagId=?
    `;
  
    // 执行查询
    const [data] = await connection.promise().query(statement, [postId, tagId]);
  
    // 提供数据
    return data[0] ? true : false;
  };
  
  /**
   * 移除内容标签
   */
  export const deletePostTag = async (postId: number, tagId: number) => {
    // 准备查询
    const statement = `
      DELETE FROM post_tag
      WHERE postId = ? AND tagId = ?
    `;
  
    // 执行查询
    const [data] = await connection.promise().query(statement, [postId, tagId]);
  
    // 提供数据
    return data;
  };

/**
 * 统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
    const { Filter } = options;
  
    // SQL 参数
    let params = [Filter.param];
  
    // 准备查询
    const statement = `
      SELECT
        COUNT(DISTINCT post.id) AS total
      FROM post
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.leftJoinOneFile}
      ${sqlFragment.leftJoinTag}
      WHERE ${Filter.sql}
    `;
//如果不需要筛选只要前三行就行，根据实际测试，的确，此中间件函数不需要任何外部输入！
    // 执行查询
    const [data] = await connection.promise().query(statement, params);
  
    // 提供结果
    return data[0].total;
  };