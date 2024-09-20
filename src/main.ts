// const greeting = '你好';
// console.log(greeting);

//导入模块，使用node.js的http功能
// const { write } = require('fs');
// const http = require('http');
// //创建服务器
// const server = http.createServer((request,Response) => {

// console.log(request.headers['user-agent']);

// Response.writeHead(200,{
//     'Content-Type':'text/html',
// })//头部数据名字、数据类型都有规范
// Response.write(`<input />`);
// Response.end();//结束响应

// switch (request.url) {
//     case '/'://请求根
//         Response.write('hello ~');
//         break;
//     case '/posts':
//         Response.write('posts');
//         break;
//     case '/signup':
//         Response.write('signup');
//         break;
//     default:
//         Response.writeHead(404);//状态码
//         Response.write('404');
//         break;
// }

//     const data = {
//         id:1,
//         title:'关山月',
//         content:'明月出天山，苍茫云海间'
//     }

//     const jsonData = JSON.stringify(data);//转换Jason
//     Response.writeHead(200,{
//         'Content-Type':'application/json;charset=utf-8'
//     })
//     Response.write(jsonData);

//     Response.end();//结束响应，否则客户端卡住不动
// });
// //监听  3000为端口号,80是默认
// server.listen(3000,() => {
//     console.log('🐱‍🚀服务已启动');
// })

//!!!!!!!!!!!!!!!---------express框架-----------!!!!!!!!!!

//const express = require('express');//导入'express'包
//标准写法如下im
import express from "express";

//导入,手工设置接口处理器参数类型,request:Request,Response:Response
import { Request, Response } from "express";

const app = express(); //制造应用交给app
const port = 3000; //服务端口

/**
 *  使用 JSON 中间件
 */
app.use(express.json()); //指定在express框架里提供中间件，进而可以处理客户端发送的JSON格式文件，接口处理器可以直接使用请求数据

app.listen(port, () => {
  console.log("🚀服务已启动~");
});

//接口地址“/”，函数就是接口的处理器
app.get("/", (request: Request, Response: Response) => {
  Response.send("你好");
});

const data = [
  {
    id: 1,
    title: "关山月",
    content: "明月出天山"
  },
  {
    id: 2,
    title: "望月",
    content: "会当凌绝顶"
  },
  {
    id: 3,
    title: "忆江南",
    content: "日出江花红胜火"
  }
];

app.get("/posts", (request: Request, Response: Response) => {
  Response.send(data);
});

//地址参数用：
app.get("/posts/:postId", (request: Request, Response: Response) => {
  //获取内容id
  const { postId } = request.params;
  //有了id,就可以把客户端想要的内容找出来
  const posts = data.filter(item => item.id == parseInt(postId, 10)); //把postId（string）转换为十进制数
  //作出响应
  Response.send(posts[0]); //第一个数据项，不加会多个[ ]
});

/**
 * 定义创建内容用的接口
 */
app.post("/posts", (request: Request, Response: Response) => {
  //拉取请求里的数据
  const { content } = request.body;

  //设置响应状态码
  Response.status(201);

  //输出请求头部数据
  console.log(request.headers["sing-along"]);

  //设置响应头部数据
  Response.set("Sing-Along", "How I wonder what you are!");

  //作出响应
  Response.send({
    message: `成功创建了内容：${content}` //反引号，单引号太像了😥
  });
});
