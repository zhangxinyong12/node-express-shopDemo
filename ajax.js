const express=require('express');
const app=express();
//设置运行跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
const data=[1,2,3,4,5,6,76,8,98];
app.get('/ajaxGet',(req,res)=>{
    res.send(data);
    // res.json({msg:data});
});
app.listen(3006)