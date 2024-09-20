//01
// function log(){
//     console.log('你好！');
// }

// log();

//02
// const log =() => {
//     console.log('你好01！');
// }

// log();

//03
// const log =(message) => {
//     console.log('你好01！',message);
// }

// // log(hello);
// log('hello');
// log("hello");

//04
// const log =(message,prefix) => {
//     console.log(prefix,message);
// }


// log('hello','qwe');
// log('qwe','hello');

//05
// const ll =(message) => {
//     return '你好'+message;
// }

// const gr = ll('周宇骐');
// // console.log(ll);
// console.log(gr);

//06
// const ll =message =>  '你好'+message;

// const gr = ll('周宇骐');

// console.log(gr);

//07
// const book = {
//     title: '小白兔的开发之路',
//     toString(){
//         return `《${this.title}》`;
//     },
// };

// console.log(book.toString());

//08
// const fruits = ['苹果','你','瞧瞧'];
// const vegetables = ['土豆','赌博','取逆'];
// const food = [...fruits,...vegetables];
// console.log(food);

//09
// const data = {
//     title:'小白兔的开发之路',
// }
// const author = {
//     name:'周宇骐',
// }
// const book = {
//     ...data,
//     author
// }
// console.log(book);

//10抛出异常
// const drive = () => {
//     throw new Error('meiyo');
// }
// drive();

//11
// const gas=()=>{
//     return true;
// };
// const drive =()=>{
//     const gass=gas();

//     if (!gass) {
//         throw new Error('没有了');
//     };

//     console.log('无为');//无异常才出现
// }

// try {
//     drive();
// }catch(error){
//     console.log(error.message);//.message只显示‘没有了’
// }

//12类
class car {
    engine;

    drive(){
        console.log('dssss');
    }
    //构造方法，自动执行
    constructor(e){
        this.engine=e;//赋值给engine属性
        console.log('一辆崭新的汽车');
    }
}//engine 为car的一个属性

//继承属性和方法
class pickuptruck extends car {}

const c1 = new car(1);//创建实例
const c2 = new car(2);
c1.drive();
console.log(c1,c2);
console.log(c1);
console.log(c2);
const p1 = new pickuptruck('v1');
p1.drive();
console.log(p1);