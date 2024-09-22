
import appp from './app';//appp是自定义的名字，自动从./app文件下寻找导出的模块应用，都不用加/index,因为app.config没有导出应用
import { APP_PORT } from './app/app.config';

appp.listen(APP_PORT,() => {
  console.log('😊服务已启动');
});