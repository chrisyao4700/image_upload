var express = require('express');
var router = express.Router();
const http = require('http');
const fs = require('fs');
const util = require('util');
const querystring =require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.use('/post_image', function (req, res, next) {
    parseFile(req,res);
});
function parseFile (req, res) {
    req.setEncoding('binary');
    var body = '';   // 文件数据
    var fileName = '';  // 文件名
    // 边界字符串
    var boundary = req.headers['content-type'].split('; ')[1].replace('boundary=','');
    req.on('data', function(chunk){
        body += chunk;
    });
    req.on('end', function() {
        var file = querystring.parse(body, '\r\n', ':')
        // 只处理图片文件
        if (file['Content-Type'].indexOf("image") !== -1)
        {
            //获取文件名
            //var fileInfo = file['Content-Disposition'].split('; ');
            var fileInfo = file['Content-Disposition'].toString().split('; ');
            for (value in fileInfo){
                if (fileInfo[value].indexOf("filename=") != -1){
                    fileName = fileInfo[value].substring(10, fileInfo[value].length-1);
                    if (fileName.indexOf('\\') != -1){
                        fileName = fileName.substring(fileName.lastIndexOf('\\')+1);
                    }
                    console.log("文件名: " + fileName);
                }
            }
            // 获取图片类型(如：image/gif 或 image/png))
            var entireData = body.toString();
            var contentTypeRegex = /Content-Type: image\/.*/;
            contentType = file['Content-Type'].substring(1);
            //获取文件二进制数据开始位置，即contentType的结尾
            var upperBoundary = entireData.indexOf(contentType) + contentType.length;
            var shorterData = entireData.substring(upperBoundary);
            // 替换开始位置的空格
            var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
            var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--'+boundary+'--'));
            // 保存文件
            fs.writeFile("josie_docs/images/" + fileName, binaryData, 'binary', function(err) {
                res.end('image posted');
            });
        } else {
            res.end('只能上传图片文件');
        }
    });
}


module.exports = router;
