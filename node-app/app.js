const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url =require('url');
const index_page = fs.readFileSync('./index.ejs','utf8');
const style_css = fs.readFileSync('./style.css','utf8');
const other_page = fs.readFileSync('./other.ejs','utf8');
const qs = require('querystring');

var server = http.createServer(getFromClient);
server.listen(3000);
console.log('Server start!');

//createServerの処理
function getFromClient(request,response){
  var url_parts = url.parse(request.url,true);
  switch (url_parts.pathname){
    case '/':
      response_index(request,response);
      break;
    case '/style.css':
      response.writeHead(200,{'Content-Type':'text/css'});
      response.write(style_css);
      response.end();
      break;
    case '/other':
    response_other(request,response);
    break;
    default:
      response.writeHead(200,{'Content-Type':'text/html'});
      response.end('no page...');
      break;
  }
}

// 追加するデータ用変数
var data = {
  'Taro':'09-999-999',
  'Hanako':'080-888-888',
  'Sachiko':'070-777-777',
  'Ichiro':'060-666-666'
};

// index.jsへのアクセス処理
function response_index(request,response){
  var msg ="これはIndexページです"
  var content = ejs.render(index_page,{
    title:"Index",
    content:msg,
    data:data,
    filename:'data_item'
  });
  response.writeHead(200,{'Content-Type': 'text/html'});
  response.write(content);
  response.end();
}

// other.jsへのアクセス
function response_other(request,response){
  var msg = "これはOhterページです";
  if (request.method=="POST"){
    var body ='';

    //データ受信のイベント処理
    request.on('data',(data)=>{
      body +=data;
    });

    //データ受信終了のイベント処理
    request.on('end',()=>{
      var post_data = qs.parse(body);
      msg += 'あなたは、「'+post_data.msg+'」と書きました';
      var content = ejs.render(other_page,{
        title:"Other",
        content:msg,
      });
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(content);
      response.end();
    });
    //GETアクセス時の処理
  }else{
    var msg = "ページがありません";
    var content = ejs.render(other_page,{
      title:"Other",
      content:msg,
    });
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.write(content);
    response.end();
  }

}

