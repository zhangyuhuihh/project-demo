// function practise(){
//     return new Promise(function(resolve,reject){
        
//     })
// }

var promise=new Promise((resolve,reject)=>{
    resolve(11)
});

let apromise= promise.then((re)=>{
    console.log(re)
})

let bpromise=apromise.then()
console.log(apromise===bpromise)