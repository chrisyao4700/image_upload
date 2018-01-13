//here is something for view controller
var $ = require('jQuery');

function uploadByForm() {
    //用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
    var formData = new FormData($("#myForm")[0]);
    var url = "http://192.168.1.204:3000/apps";
    alert('I am here');
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,

        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        success: function (responseStr) {
            alert(responseStr.newPath);
            $("img").attr({"src": responseStr.newPath}).prependTo($("body"));
        },
        error: function (responseStr) {
            alert(responseStr.newPath);
        }
    });
}