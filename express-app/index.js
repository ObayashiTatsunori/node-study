var express = require('express');
var ejs = require("ejs");
var app = express();

app.engine('ejs', ejs.renderFile);

app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var data = {
    'Taro': 'taro@yamada',
    'Hanako': 'hanako@flower',
    'Sachiko': 'sachiko@happy',
    'Ichiro': 'ichiro@baseball',
};
// トップページ
app.get('/', (req, res) => {
    var msg = 'This is Express Page!<br>' +
        '※メッセージを書いて送信してください';
    res.render('index.ejs', {
        title: 'Index',
        content: msg,
        data: data,
    });
});
//POST送信の処理
app.post('/', (req, res) => {
    var msg = 'This is Posted Page!<br>' +
        'あなたは「<b>' + req.body.message +
        '</b>」と送信しました。';
    res.render('index.ejs', {
        title: 'Posted',
        content: msg,
    });
});

var server = app.listen(3000, () => {
    console.log('Start server port:3000')
});