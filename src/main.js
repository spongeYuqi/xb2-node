// const greeting = '你好';
// console.log(greeting);

//导入模块，使用node.js的http功能
const http = require('http');
//创建服务器
const server = http.createServer((request,Response) => {
    Response.write('hello~');
    Response.end();//结束响应
});
//监听  3000为端口号
server.listen(3000,() => {
    console.log('🐱‍🚀服务已启动');
})