function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("get", URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            };
            req.send();
        }
    })
}
//运行示例
var URL = "http://httpbin.org/get";
getURL(URL).then(function onFullfilled(value) {
    console.log(value);
}).catch(function onRejected(error) {
    console.error(error)
})

// -----------------------------------------------------------------------
//代码的写法并不是没有规范和组织的
function ccc(G) {
    console.log(G)
}

var demo = [{ ddd: ccc,eee:[]}];
var mingcheng="ddd";
demo.shift()[mingcheng](11);

// -----------------------------------------------------------------------
function onReady(fn) {
    var readyState = document.readyState;
    if (readyState === "interactive" || readyState === "complete") {
        fn();
        // 统一使用异步的方式的话
        //setTimeout(fn,0)
    } else {
        window.addEventListener('DOMContentLoaded', fn);
    }
}
onReady(function () {
    console.log('DOM fully loaded an parsed')
});
console.log("==Staring==")

//用promise写的话
//promise保证每次调用都是以异步的方式进行的，所以我们在实际的编码中不需要调用setTimeout来自己实现异步调用
function onReadyPromise() {
    return new Promise(function (resolve, reject) {
        var readyState = document.readyState;
        if (readyState === "interractive" || readyState === "complete") {
            resolve();
        } else {
            window.addEventListener('DOMContentLoaded', resolve);
        }
    })
}
onReadyPromise().then(function () {
    console.log('DOM fully loaded and parsed')
});
console.log('==Starting==')


//promise#then
function taskA() {
    console.log("TaskA");
}
function taskB() {
    console.log("TaskB")
}
function onRejected(error) {
    console.log("Catch Error:A or B", error);
}
function finallTask() {
    console.log("Final Task")
}

var promise = Promise.resolve();
promise.then(taskA)
    .then(taskB)
    .catch(onRejected)
    .then(finallTask)

//Promise#catch
var promise = Promise.reject(new Error("message"));
promise.catch(function (error) {
    console.error(error)
});

//每次调用then都会返回一个新创建的promise对象
//这里的aPromise与thenpromise是两个不同的promise对象
var aPromise = new Promise(function (resolve) {
    resolve(100);
});
var thenPromise = aPromise.then(function (value) {
    console.log(value);
});
var catchPromise = thenPromise.catch(function (error) {
    console.error(error);
})
console.log(aPromise !== thenPromise);
console.log(thenPromise !== catchPromise);


//需要多个对象的promise变为FulFilled状态的时候再进行某种处理程序



// ----------------------------------------------------------------------------------------------------------
//普通的回调函数风格的XHR处理代码
// 函数1
function getURLCallback(URL, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', URL, true);
    req.onload = function () {
        if (req.status === 200) {
            callback(null, req.responseText);
        } else {
            callback(new Error(req.statusText), req.response);
        };
        req.onerror = function () {
            callback(new Error(req.statusText))
        };
        req.send();
    }
}
//函数2
function jsonParse(callback, error, value) {
    if (error) {
        callback(error, value);
    } else {
        try {
            var result = JSON.parse(value);
            callback(null, result)
        } catch (e) {
            callback(e, value)
        }
    }
}

// 发送请求
var request = {
    comment: function getComment(callback) {
        return getURLCallback('http://azu.github.io/promises-book/json/comment.json', jsonParse.bind(null, callback))
    },
    people: function getPeople(callback) {
        return getURLCallback('http://azu.github.io/promises-book/json/people.json', jsonParse.bind(null, callback))
    }
}
//启用多个XHR请求，当所有的请求返回时调用callback
function allRequest(requests, callback, results) {
    if (requests.length === 0) {
        return callback(null, results);
    }
    var req = request.shift();
    req(function (error, value) {
        if (error) {
            callback(error, value)
        } else {
            results.push(value);
            allRequest(request, callback, results)
        }
    })
}
function main(callback) {
    allRequest([request.comment, rquest.people], callback, []);
}

//运行时的例子
main(function (error, results) {
    if (error) {
        return console.error(error);
    }
    console.log(results);
})
// -------------------------------------------------------------------
// 使用promise的then方法
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
var request = {
    comment: function getComment() {
        return getURL('http://azu.github.io/promises-book/json/comment.json').then(JSON.parse);
    },
    people: function getPeople() {
        return getURL('http://azu.github.io/promises-book/json/people.json').then(JSON.parse);
    }
};
function main() {
    function recordValue(results, value) {
        results.push(value);
        return results;
    }
    // [] 用来保存初始化的值
    var pushValue = recordValue.bind(null, []);
    return request.comment().then(pushValue).then(request.people).then(pushValue);
}
// 运行的例子
main().then(function (value) {
    console.log(value);
}).catch(function (error) {
    console.error(error);
});

// --------------------------------------------------------------------------------
// promise.all方法
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
var request = {
    comment: function getComment() {
        return getURL('http://azu.github.io/promises-book/json/comment.json').then(JSON.parse);
    },
    people: function getPeople() {
        return getURL('http://azu.github.io/promises-book/json/people.json').then(JSON.parse);
    }
};

function main(){
    return Promise.all([request.comment(),request.people()])
}
// 运行实例
main().then(function(value){
    console.log(value)
}).catch(function(error){
    console.log(error);
});

// ---------------------------------------------------------------------------------------------
