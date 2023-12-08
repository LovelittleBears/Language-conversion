var fs = require("fs");
var path = require("path");
const OpenCC = require("opencc");
/*
  s2t	简体到繁体
  t2s	繁体到简体
  s2tw	简体到台湾繁体
  tw2s	台湾繁体到简体
  s2hk	简体到香港繁体
  hk2s	香港繁体到简体
  s2twp	简体到台湾繁体，并转换为台湾常用词汇
  tw2sp	台湾繁体到简体，并转换为中国大陆常用词汇
  tw2t	台湾繁体到繁体
  t2tw	繁体到台湾繁体
  hk2t	香港繁体到繁体
  t2hk	繁体到香港繁体
  t2jp	繁体到日本新字体
  jp2t	日本新字体到繁体
*/
const converter = new OpenCC("s2t.json");
var list = [];

//输入你的路径
var url = String.raw`./directory`;
//对路径正则
var format = url.replace(/\\/g, "/");

//改多个文件
function manyFile() {
  //遍历文件下的文件
  function listFile(dir) {
    var arr = fs.readdirSync(dir);
    arr.forEach(function (item) {
      var fullpath = path.join(dir, item);
      var stats = fs.statSync(fullpath);
      if (stats.isDirectory()) {
        listFile(fullpath);
      } else {
        list.push(fullpath);
      }
    });
    return list;
  }
  var res = listFile(format);
  res.forEach((item, index) => {
    fs.readFile(item, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }
      const simplifiedText = converter.convertSync(data);
      console.log(simplifiedText);
      fs.writeFile(item, simplifiedText, (errs) => {
        if (err) throw errs;
        console.log("成功");
      });
    });
  });
}
//单文件方法
function singleFile(){
  fs.readFile(url, "utf8", (err, data) => {
    if (err) {
      console.error("读取文件失败:", err);
      return;
    }
    const simplifiedText = converter.convertSync(data);
    console.log(simplifiedText);
    fs.writeFile(url, simplifiedText, (errs) => {
      if (err) throw errs;
      console.log("成功");
    });
  });
}
//执行多文件遍历方法
manyFile()
//执行单文件方法
// singleFile()
