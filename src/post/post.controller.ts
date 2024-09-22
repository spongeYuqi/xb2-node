import { Request, Response, NextFunction } from "express";
import { getPosts } from "./post.service";

/**
 * 内容列表   导出函数定义
 */
export const index = (
    req: Request,
    res: Response,
    nex: NextFunction
) => {
    if (req.headers.authorization !== 'SECRET') {
        return nex(new Error());//不加return 会继续执行接口处理器的其他代码
        //if 条件严格执行
    }
    const posts = getPosts();
    // res.send('内容列表接口');
    res.send(posts);//亲测可以直接res.send(getPosts());
};