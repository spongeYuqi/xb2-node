import request from 'supertest';
import app from '../app';
import { connection } from './database/mysql';
import { greet } from './playground/demo';

/**
 * 单元测试
 */
describe('演示单元测试', () => {
  // 测试
  test('测试 greet 函数', () => {
    // 准备
    const greeting = greet('周宇骐');

    // 断言
    expect(greeting).toBe('你好 ！ 周宇骐');//人为预期结果与真实运行相比较
  });
});


/**
 * 测试接口
 */
describe('演示接口测试', () => {
    afterAll(async () => {
      // 断开数据服务连接
      connection.end();
    });
  
    test('测试 GET /', async () => {
      // 请求接口
      const response = await request(app).get('/');
  
      // 做出断言
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ title: '周宇骐的开发之路' });
    });
  
    //第二个接口测试，如果没有两个及以上，就会报错，Mysql2:ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From app/app.test.ts.
    test('测试 POST /echo', async () => {
      // 请求接口
      const response = await request(app)
        .post('/echo')
        .send({ message: '你好 ~' });
  
      // 做出断言
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: '你好 ~' });
    });
  });
