import { Request, Response, NextFunction } from 'express';
import { POSTS_PER_PAGE } from '../app/app.config';
import { toNumber } from 'lodash';

/**
 * 排序方式
 */
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 获取客户端的排序方式
  const { sort } = request.query;

  // 排序用的 SQL
  let sqlSort: string;

  // 设置排序用的 SQL
  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC ,post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  // 在请求中添加排序
  request.sort = sqlSort;

  // 下一步
  next();
};

/**
 * 过滤列表
 */
export const filter = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // 解构查询符
    const { tag, user, action } = req.query;
  
    // 设置默认的过滤
    req.Filter = {
      name: 'default',
      sql: 'post.id IS NOT NULL',
    };
  
    // 按标签名过滤
    if (tag && !user && !action) {
      req.Filter = {
        name: 'tagName',
        sql: 'tag.name = ?',
        param: `${tag}`,
      };
    }
  
    // 过滤出用户发布的内容
    if (user && action == 'published' && !tag) {
      req.Filter = {
        name: 'userPublished',
        sql: 'user.id = ?',
        param: `${user}`,
      };
    }
//${tag}会从url中获取tag的赋值

    // 过滤出用户赞过的内容
    if (user && action == 'liked' && !tag) {
        req.Filter = {
          name: 'userLiked',
          sql: 'user_like_post.userId = ?',
          param: `${user}`,
        };
      }


  // 下一步
  next();
};

/**
 * 内容分页
 */
export const paginate = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //当前页码
  const { page = 1} = request.query;//page提供了默认值1。这意味着如果request.query对象中不存在page属性，那么变量page将被赋予默认值1。

  //每页内容数量
  const limit = parseInt(POSTS_PER_PAGE, 10) || 30;

  let PAGE = Number(page);

  //计算出偏移量
  const offset = limit * (PAGE - 1 );
  
  //设置请求中的分页
  request.pagination = { limit, offset };

  // 下一步
  next();
};