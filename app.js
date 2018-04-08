const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('multiparty'); //图片上传模块
const session = require('express-session');
const md5 = require('md5-node');
const DB = require('./modules/db');//mongodb
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'gfuiashgufdi',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure:true
        maxAge: 1000 * 60 * 30,
    },
    rolling: true
}));
//ejs
app.set('view engine', 'ejs');
//静态文件
app.use(express.static('public'));
app.use('/upload', express.static('upload'));

//中间件。处理登陆状态
app.use((req, res, next) => {
    if (req.url == '/login' || req.url == '/doLogin') {
        next();
    } else {
        if (req.session.userinfo && req.session.userinfo.username != '') {
            //ejs 全局变量
            app.locals['username'] = req.session.userinfo.username;
            next();
        } else {
            //跳转
            res.redirect('/login');
        }
    }
});
app.get('/', (req, res) => {
    res.send('index');
});
//登陆 
app.get('/login', (req, res) => {
    // res.send('login');
    res.render('login');
});
app.get('/loginOut', (req, res) => {
    // res.send('login');
    req.session.destroy((err) => {
        if (err) console.log(err);
    });
    res.redirect('/login');
});
//获取登录提交的数据
app.post('/doLogin', function (req, res) {
    DB.find('user', {
        username: req.body.username,
        password: md5(req.body.password)
    }, (data) => {
        if (data.length > 0) {
            req.session.userinfo = data[0];
            res.redirect('/product');
        } else {
            console.log('登陆失败');
            res.send('<script>alert("密码错误");location.href="/login"</script>');
        };
    });
})
//商品 增加分页
app.get('/product', (req, res) => {
    const Num = req.query.pageNum || 1;
    const Size = req.query.pageSize || 10;
    DB.count('productList', {}, (data) => {
        const count = data;
        DB.limit('productList', Size, (Num - 1) * Size, (data) => {
            res.render('product', {
                list: data,
                pageNum: Num,
                pageSize: Size,
                con: count
            });
        });
    });

});
//增加页面
app.get('/productAdd', (req, res) => {
    res.render('productadd');


});
//增加逻辑
app.post('/doProductAdd', (req, res) => {
    const form = new multiparty.Form();
    form.uploadDir = 'upload';
    form.parse(req, (err, fields, files) => {
        const title = fields.title[0];
        const price = fields.price[0];
        const fee = fields.fee[0];
        const description = fields.description[0];
        const pic = files.pic[0].path;
        DB.insert('productList', { title, price, fee, pic, description }, (data) => {
            res.redirect('/product');
        })
    });
});
//修改 获取原始数据
app.get('/productEdit', (req, res) => {
    const id = req.query.id;
    DB.find('productList', { '_id': new DB.ObjectID(id) }, (data) => {
        res.render('productedit', {
            list: data[0]
        });
    })

});
//修改  提交

app.post('/update', (req, res) => {
    const id = req.query.id;
    const form = new multiparty.Form();
    form.uploadDir = 'upload';
    form.parse(req, (err, fields, files) => {
        const title = fields.title[0];
        const price = fields.price[0];
        const fee = fields.fee[0];
        const description = fields.description[0];
        const pic = files.pic[0].path;
        const originalFilename = files.pic[0].originalFilename;
        let setData;
        if (originalFilename) {
            setData = { title, price, fee, pic, description };
        } else {
            setData = { title, price, fee, description };
            fs.unlink(pic); //删除生产的无效   
        }
        DB.update('productList', { '_id': new DB.ObjectID(id) }, setData, (data) => {
            res.redirect('/product');
        })
    });

});
//删除
app.get('/deleteOne', (req, res) => {
    const id = req.query.id;
    DB.deleteOne('productList', { '_id': new DB.ObjectID(id) }, (data) => {
        res.redirect('/product');
    })
});
//获取总数
app.get('/count', (req, res) => {
    DB.count('productList', {}, (data) => {
        console.log(data);
    })
});
app.listen(8989, '127.0.0.1');