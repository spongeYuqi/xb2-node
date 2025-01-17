export const greet = (name: string) => {
    return `你好 ！ ${name}`;
};
//手动测试
const greeting = greet(`周宇骐`);
console.log(greeting);