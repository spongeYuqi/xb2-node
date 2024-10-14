import { Request, Response, NextFunction } from "express";
import { 
    getPosts, 
    creatPost, 
    updatePost, 
    deletePost,
    createPostTag,
    postHasTag,
    deletePostTag,
} from "./post.service";
import { TagModel } from "../tag/tag.model";
import { getTagByName, createTag } from "../tag/tag.service";
import _ from 'lodash';//_下划线表示提供很多方法



/**
 * 内容列表   导出函数定义
 */
// export const index = (
//     req: Request,
//     res: Response,
//     nex: NextFunction
// ) => {
//     if (req.headers.authorization !== 'SECRET') {
//         return nex(new Error());//不加return 会继续执行接口处理器的其他代码
//         //if 条件严格执行
//     }
//     const posts = getPosts();
//     // res.send('内容列表接口');
//     res.send(posts);//亲测可以直接res.send(getPosts());
// };


/////        async使用异步函数，因为从数据库拉取需要时间
//getposts
export const index = async (
    req: Request,
    res: Response,
    nex: NextFunction
) => {
    
    // const posts = await getPosts();
    // // 等待getPosts return的data赋值给posts
    // res.send(posts);//亲测可以直接res.send(getPosts());

    try {
        const posts = await getPosts();
        res.send(posts);

    } catch (error) {
        nex(error);//交给默认错误处理器处理
    }
};



//creatpost
/**
 * 创建内容
 */
export const store = async (
    req: Request,
    res: Response,
    nex: NextFunction
) => {
    //准备数据
    const {title,content} = req.body;//id是可选的（不断send,会自增），来自请求的Body
    const { id: userID } = req.user;//将提取出来的 id 属性值改名为 userId 的变量（因为PostModel中是userId）


    //创建内容
    try {
        const data = await creatPost({title,content,userID});//实则就是执行sql语句返回的data的title,content
        res.status(201).send(data);
        //想要得到INSERt的数据呢？用第一次的get即可
    } catch (error) {
        nex(error);
    }
};
//据库驱动程序（如 mysql2）在执行 INSERT 操作后，默认返回一个包含操作结果的元数据对象
//这个对象包含了有关插入操作的一些统计信息，如受影响的行数、插入的 ID 等


/**
 * 更新内容
 */
export const update = async (
    req: Request,
    res: Response,
    nex: NextFunction//最后一个参数不用加,
) => {
    //获取内容 ID  req.params 对象中解构出 postId 变量
    const {postId} = req.params;//req.params 是一个对象，其中包含了从请求 URL 中提取出来的所有命名参数,这些参数是在路由定义时通过冒号 (:) 指定的

    //准备数据
    // const {title,content} = req.body;
    //使用loadsh
    const post = _.pick(req.body,['title','content']);

    //更新
    try {
        const data = await updatePost(parseInt(postId,10),post);//async (postID:number,post:PostModel)
        res.send(data);
    } catch (error) {
        nex(error);
    }

};



/**
 * 删除内容  名字不能用delete(内置关键词)
 */
export const destroy = async (
    req: Request,
    res: Response,
    nex: NextFunction//最后一个参数不用加,
) => {
    //获取内容 ID  req.params 对象中解构出 postId 变量
    const {postId} = req.params;

   
    //删除内容
    try {
        const data = await deletePost(parseInt(postId,10));
        res.send(data);
    } catch (error) {
        nex(error);
    }

};


/**
 * 添加内容标签
 */
export const storePostTag = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    // 准备数据
    const { postId } = request.params;
    const { name } = request.body;
  
    let tag: TagModel;
  
    // 查找标签
    try {
      tag = await getTagByName(name);
    } catch (error) {//查询出现错误，不是查询为空
      return next(error);
    }
  
    // 找到标签，验证内容标签
    if (tag) {
      try {
        const postTag = await postHasTag(parseInt(postId, 10), tag.id);
        if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
      } catch (error) {
        return next(error);
      }
    }
  
    // 没找到标签，创建这个标签
    if (!tag) {
      try {
        const data = await createTag({ name });
        tag = { id: data.insertId };//添加id属性，创建数据记录的id号
      } catch (error) {
        return next(error);
      }
    }
  
    // 给内容打上标签
    try {
      await createPostTag(parseInt(postId, 10), tag.id);
      response.sendStatus(201);
    } catch (error) {
      return next(error);
    }
  };
  
  /**
   * 移除内容标签
   */
  export const destroyPostTag = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    // 准备数据
    const { postId } = request.params;
    const { tagId } = request.body;
  
    // 移除内容标签
    try {
      await deletePostTag(parseInt(postId, 10), tagId);
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };