
//定义函数，函数都可以作为构造函数（这里是下面的new创建的构造函数的原版函数）
var Promise = function () {
    this.callbacks = [];
    //这里的属性和下面的原型属性的区别是：
    //这里的属性，如果我通过new构造函数创建了两个实例对象1和2，
    //那么1和2的callback是两个完全不相关的东西（也就是占用了两份内存），
    //但是如果是原型对象的话，就算创建了两个对象，两个对象所用的原型属性（函数），是指向同一个内存的
    //
}
var Promise22 = function (name) {
    this.name = name;
}
var promise1 = new Promise();
var promise2 = new Promise();
console.log(promise1.callbacks == promise2.callbacks)
console.log(promise1.resolve == promise2.resolve)
console.log(typeof (Promise))
//创建上面定义的promise对象的原型属性，使得所有的实例都能共享这些方法
//不需要在构造函数中定义对象实例的信息，例:var xx= new promise()，因为定义了
//promise的原型属性，所以new promise（）后面括号里面不需要写对象实例的信息，这里的xx
//便已经继承了所有的原型属性。
Promise.prototype = {

    construct: Promise,

    resolve: function (result) {
        this.complete("resolve", result);
    },

    reject: function (result) {
        this.complete("reject", result)
    },

    complete: function (type, result) {
        //这里的while函数
        while (this.callbacks[0]) {
            //这里的type决定是执行then里面的哪个函数
            this.callbacks.shift()[type](result);
            
        }
    },

    then: function (successHandler, failedHandler) {
        this.callbacks.push({
            //这里的resolve是属性名称，在上面的type是字符串
            resolve: successHandler,
            reject: failedHandler
        });
        return this;
    }
}

//test
//使用构造函数创建对象（也就是实例），这里的promise是一个函数对象
var promise = new Promise();
var delay1 = function () {
    setTimeout(function () {
        promise.resolve('数据1');
    }, 1000);
     console.log(promise)
    return promise;
   
}

var callback1 = function (re) {
    re = re + '数据2';
    console.log(re)
    promise.resolve(re)
    console.log(promise)
};

var callback2 = function (re) {
    console.log(re + "数据3")
}

var callback333 = function () {
    console("通过失败")
}

delay1().then(callback1).then(callback2)

