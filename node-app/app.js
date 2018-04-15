const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const qs = require('querystring');

var server = http.createServer(getFromClient);
server.listen(3000);
console.log('Server start!');

//createServerの処理
function getFromClient(request, response) {
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        case '/':
            response_index(request, response);
            break;
        case '/style.css':
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(style_css);
            response.end();
            break;
        case '/other':
            response_other(request, response);
            break;
        default:
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end('no page...');
            break;
    }
}

// 追加するデータ用変数
var data = {
    'Taro': '09-999-999',
    'Hanako': '080-888-888',
    'Sachiko': '070-777-777',
    'Ichiro': '060-666-666'
};
var data = { msg: 'no message...' };

// index.jsへのアクセス処理
function response_index(request, response) {

    // POSTアクセス時の処理
    if (request.method == 'POST') {
        var body = '';

        //　データ受信のイベント処理
        request.on('data', (data) => {
            body += data;
        });

        //　データ受信終了のイベント処理
        request.on('end', () => {
            data = qs.parse(body); //　データのパース
            // クッキーの保存
            setCookie('msg', data.msg, response);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }

    // indexの表示の作成
    function write_index(request, response) {
        var msg = "※伝言を表示します";
        var cookie_data = getCookie('msg', request);
        var content = ejs.render(index_page, {
            title: "Index",
            content: msg,
            data: data,
            cookie_data: cookie_data,
        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();
    }
}

function setCookie(key, value, response) {
    var cookie = escape(value);
    response.setHeader('Set-Cookie', [key + '=' + cookie]);
}

function getCookie(key, request) {
    var cookie_data = request.headers.cookie != undefined ?
        request.headers.cookie : '';
    var data = cookie_data.split(';');
    for (var i in data) {
        if (data[i].trim().startsWith(key + '=')) {
            var result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }
    return '';
}

var data2 = {
    'Taro': ['taro@yamada', '09-999-999', 'Tokyo'],
    'Hanako': ['hanako@flower', '080-888-888', 'Yokohama'],
    'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
    'Ichiro': ['ichi@baseball', '060-666-666', 'USA']
}

// other.jsへのアクセス
function response_other(request, response) {
    var msg = "これはOhterページです";
    var content = ejs.render(other_page, {
        title: "Other",
        content: msg,
        data: data2,
        filename: 'date_item'
    });
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.write(content);
}