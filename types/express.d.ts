//扩展请求类型  给express框架的request添加user属性，它原本是没有的
/**
 * 在 Express 应用程序中扩展 Request 接口，以便在请求对象中包含一个 user 属性，该属性类型为 TokenPayload。
 * 这样做可以让开发者在请求处理函数中方便地访问经过解码和验证的 JWT 令牌中的用户信息。
 */
import { TokenPayload } from '../src/auth/auth.interface';

//声明gloabal  命令空间Express   
declare global {
    namespace Express {
        export interface Request {
            user: TokenPayload;
            fileMetaData: { width?: number; height?: number; metadata?: {} };//让其他中间件或接口处理器使用图片信息
        }
    }
}
/**
 * declare global：这是 TypeScript 提供的一个关键字，用于声明全局变量或扩展全局对象。在这个上下文中，我们使用它来扩展全局的 Express.Request 接口
 * namespace Express：这里我们指定了要扩展的对象是 Express 命名空间下的 Request 对象。Express 是一个命名空间，包含了 Request 和 Response 等类型定义,在 TypeScript 中，命名空间（namespace）的名字没有严格的要求，但是有一些最佳实践和约定可以帮助你更好地组织代码并避免命名冲突。
 * export interface Request：这里我们扩展了 Express 命名空间下的 Request 接口。interface 关键字用于定义一个类型接口，它可以描述对象的形状（即属性和方法）
 * user: TokenPayload;：这是我们在 Request 接口中新增的一个属性 user，它的类型为 TokenPayload。这意味着在任何使用 Request 类型的地方，都可以使用 req.user 来访问类型为 TokenPayload 的用户信息
 */