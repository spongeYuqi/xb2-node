
import { error } from 'console';
import appp from './app';//appp是自定义的名字，自动从./app文件下寻找导出的模块应用，都不用加/index,因为app.config没有导出应用
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';



appp.listen(APP_PORT,() => {
  console.log('✨✨服务已启动✨✨');
});

/**
 * 测试使用数据服务连接
 */
//connect 方法用于尝试建立与数据库的实际连接，如果连接失败，error 参数将包含错误信息；如果连接成功，error 参数将是 null
connection.connect(error => {
  if(error) {
    console.log('连接数据服务失败：',error.message);
    return;//立即停止执行后续代码，并返回给调用者指定的值，结束当前的回调函数执行，不再执行后面的代码。这是因为一旦检测到错误，就没有必要继续执行连接成功的逻辑
  }

  console.log('成功连接数据服务~~');
})