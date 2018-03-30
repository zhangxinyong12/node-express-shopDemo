const express=require('express');
const MongoClient=require('mongodb').MongoClient;
const app=express();
const dbUrl='mongodb://127.0.0.1:27017/shopDemo';
app.get('/mongo',(req,res)=>{
    MongoClient.connect(dbUrl,(err,db)=>{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        if(err){
            res.send('数据库链接失败');
            return;
        };
        res.write('数据库链接成功');
        const arr=db.collection('user').find();
        arr.toArray((err,data)=>{
            if(err) return;
            console.log(data);
        });
        res.end();
        db.close();
    })
});
app.listen(8020);