const websocketserver=require('ws').Server;
const ws=new websocketserver({port:8989});
ws.on('connection',(ws)=>{// 链接
    console.log('链接');
    const data={a:'链接啊'};
    ws.send(JSON.stringify(data)); //发送数据
    ws.on('message',(message)=>{ //接收数据
        const data={a:'你好啊'};
        ws.send(JSON.stringify(data)); //发送数据
        console.log(message);
    });
});
