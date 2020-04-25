/*
项目中有一个文件上传功能
该功能可以上传多个文件

*/

function Uploader() {}
uploader.prototype.init = function () {};
uploader.prototype.delete = function () {};
uploader.prototype.upload = function (fileType, file) {};

var uploader = new Uploader();

var arr = [
  {
    type: "doc",
    file: fileBolb1,
  },
  {
    type: "doc",
    file: fileBolb2,
  },
  {
    type: "doc",
    file: fileBolb3,
  },
];

arr.forEach((item) => {
  uploader.upload(item.type, item.file);
});
