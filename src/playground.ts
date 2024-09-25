//01
// //回调函数（Callback Function）：作为参数传递给调用者函数
// const nature = callback => {
//     const data = `✨✨🌐✨✨`;
//     callback(data);
// };


// //调用者函数（Caller Function）：接收 callback 函数作为参数
// nature(data => {
//     console.log(data);
// });


//02
// const nature = () => {
//     console.log('...');

//     return new Promise((resolve,rejeect) => {
//         setTimeout(() => {
//             resolve('🤝(⊙﹏⊙)🤝');
//         }, 2000);//2000ms后执行
        
//     });
// };

// nature().then(data => {//data是指Promise交给resolve函数的值
//     console.log(data);
// });

// console.log('✨✨🎈✨');



//03
const nature = () => {
    console.log('...');

    return new Promise((resolve,rejeect) => {
        setTimeout(() => {
            resolve('🤝(⊙﹏⊙)🤝');
        }, 2000);//2000ms后执行
    });
};

//异步函数
const demo = async () => {
    const data = await nature();//执行nature之后得到的结果，等待promise得到的数据
    console.log(data);
};

demo();

console.log('✨✨🎈✨');

