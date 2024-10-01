//内容数据的类  内容数据的属性，对应属性的类型等

//描述用户发布的内容
export class PostModel {
    id?:number;
    title?:string;
    content?:string;//? 表示这个属性是可选的，即可以存在也可以不存在
    userID?:number;
}