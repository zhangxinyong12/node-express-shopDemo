const MongoClient=require('mongodb').MongoClient;
const DbUrl='mongodb://localhost:27017/shopDemo';  
const ObjectID=require('mongodb').ObjectID;

const _connectDb=(callback)=>{
    MongoClient.connect(DbUrl,(err,db)=>{
        if(err){
            console.log(err,'数据库链接失败');
            return;
        };
        callback(db);
    });
};
//获取id
exports.ObjectID=ObjectID;
//查找
exports.find=(collectionname,json,callback)=>{
    _connectDb((db)=>{
        const result=db.collection(collectionname).find(json);
        result.toArray((error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}
//查询总数
exports.count=(collectionname,json,callback)=>{
    _connectDb((db)=>{
        const count=db.collection(collectionname).count(json,(err,data)=>{
            callback(data);
            db.close();
        });
        
        
    });
}
//分页查询 limit 结果数量 skip 偏移量 
// find().skip((page-1)*n).skip(n) 
exports.limit=(collectionname,num1,num2,callback)=>{
    num1=parseInt(num1);//这个地方再转换一次。确保参数为 number
    num2=parseInt(num2);
    _connectDb((db)=>{
        const result=db.collection(collectionname).find().skip(num1).limit(num2);
        result.toArray((error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}
//增加
exports.insert=(collectionname,json,callback)=>{
    _connectDb((db)=>{
        const result=db.collection(collectionname);
        result.insertOne(json,(error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}
//批量增加
exports.insertMany=(collectionname,arrjson,callback)=>{
    _connectDb((db)=>{
        const result=db.collection(collectionname);
        result.insertMany(arrjson,(error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}
//修改
exports.update=(collectionname,json1,json2,callback)=>{
    _connectDb((db)=>{
        const result=db.collection(collectionname);
        result.updateOne(json1,{$set:json2},(error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}

//删除
exports.deleteOne=(collectionname,json,callback)=>{
    _connectDb((db)=>{
        const result=db.collection(collectionname);
        result.deleteOne(json,(error,data)=>{
            if(error){
                return;
            };
            db.close();
            callback(data);
        });
    });
}

