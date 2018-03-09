//屏幕适应 250为左栏的总宽度
function resizeScreen(){
    var winWid = $(window).width();
    var winHg = $(window).height() ;
    $(".leftNav").height(winHg); //左栏高度

    // //自适应时，清除表头，重新生成表头
    // $("#hdtable1").remove();
    // $("#table1").freezeHeader({'height':$(window).height() + "px"});

    //导航菜单折叠
    var isCloseSecondNav = $(".amenu b").attr("class");
    if(isCloseSecondNav == "close"){
        $(".rTopBar").width(winWid - 50);
        $(".wrapCont").width(winWid - 50 - 40);
    }else{
        $(".rTopBar").width(winWid - 250);
        $(".wrapCont").width(winWid - 250 - 40);
    }

    //表格高度自适应
    var rTopBarHg = $(".rTopBar").height();
    $(".wrapCont").height(winHg - rTopBarHg);
    $(".listTb, .loading1").height(winHg - rTopBarHg - 83);
    $("#hdScrolltable1").height($(".listTb").height());
}

//浮层提示: wid宽度；align参数为0 1 2表示文本位置居左中右,times为消失的时间默认2.5秒
function addTips(txt, wid, align, times){
    if(typeof(times) == "undefined"){
        times = 3000;
    }
    if($(".tips").length > 0){
        return false;
    }else{
        if(align == 0){
            txtAlign = "left"
        }else if(align == 1){
            txtAlign = "center"
        }else{
            txtAlign = "right"
        }
        var tipsObj = $('<div class="tips"><p style="width:'+ wid +'px; text-align:'+ txtAlign +'">'+ txt + '</p></div>');
        $("body").append(tipsObj);
        setTimeout(function(){
            $(".tips").animate({opacity:0}, 500, function(){
                $(".tips").remove();
            });
        }, times);
    }
}


//主窗体的弹出窗口
function menuShowdialog(type, typeid, title, width, height) {
    var url = type + '?rnd=' + Math.random();
    art.dialog.open(url, { title: title, id: typeid, width: width, height: height, lock: true, opacity: 0.7, close: function () { } });
    // mif.showErrorMessageBox(type);
}


//主窗体的带参数的弹出窗口
//pars 传入 "&pk=1&test=2&id=3" 样式字符串
//这个typeid指的是弹出窗口的ID
function menuShowdialogWithPars(type, typeid, title, width, height, pars, callbackfun, callbackpars) {
    var url = type + '?rnd=' + Math.random() + pars;
    art.dialog.open(url, { title: title, id: typeid, width: width, height: height, lock: true, opacity: 0.7, close: function () { if (callbackfun) callbackfun(callbackpars); } });
}



//主窗体的带参数的弹出窗口,带审核按钮的回调函数
//pars 传入 "&pk=1&test=2&id=3" 样式字符串
//这个typeid指的是弹出窗口的ID
//callbackname 回调函数
//callbackpars 回调参数，如果是多参数的话，请使用JSON传递进来
function menuShowdialogWithAuditCallBack(type, typeid, title, width, height, parsgetUserid, pars, callbackname, callbackpars) {
    var url = type + '?rnd=' + Math.random() + pars;
    art.dialog.open(url, {
        title: title, id: typeid, width: width, height: height, lock: true, opacity: 0.7,
        button:
            [
                {
                    name: '同意',
                    callback: function () {
                        //this.content('你同意了').time(2);
                        var audit = { audit: '同意' };
                        callbackpars.push(audit);
                        callbackpars[audit] = value;
                        callbackname(callbackpars);
                    }
                },
                {
                    name: '不同意',
                    callback: function () {
                        var audit = { audit: '不同意' };
                        callbackpars.push(audit);
                        callbackname(callbackpars);
                    }
                }
            ]
    });

}

//弹出图片窗口
function menuShowDialogWithPic(title, zpwjm, width) {
    var margintop = 0;
    if ($(document).height() <= 768) {
        margintop = '20%';
    } else {
        margintop = 185;
    }

    art.dialog({
        max: true,
        padding: 0,
        title: title,
        width: width,
        content: '<img style="width:' + width + 'px;" width="' + width + '" src="' + zpwjm + '"  />',
        lock: true,
        resize: true,
        top: margintop
    });
}
//
// /***弹出图片预览窗口***/
// //json 为绑定图片列表的JSON，需要包含 zpwjm,thumwjm
// //field 为json 中需要显示图片信息的字段名
// //fieldname 为需要显示在界面中的字段名信息（因为数据库通常返回英文）
// //pictype 为图片类型，为了方便调用图片信息的查询接口
// //index 为当前点击图片在 json中的序号，用于预览窗口的定位
// function  menuShowDialogPicView(title,json,field,fieldname,pictype,index) {
//     //对json 进行处理，返回符合弹出窗口数据要求的格式
//     var picList =[];
//     for(var i=0;i<json.length;i++){
//         var picobj={};
//         if(json[i].ZPWJM) picobj["zpwjm"] = json[i].ZPWJM;//照片文件名
//         if(json[i].zpwjm) picobj["zpwjm"] = json[i].zpwjm;//json对象大小写补充
//         if(json[i].yswjm) picobj["zpwjm"] = json[i].yswjm;//元素文件名
//         if(json[i].YSWJM) picobj["zpwjm"] = json[i].YSWJM;//json对象大小写补充
//         if(json[i].YSURL) picobj["zpwjm"] = json[i].YSURL;//更改为新的图片显示方式
//         if(json[i].ysurl) picobj["zpwjm"] = json[i].ysurl;//json对象的大小写补充
//         if(json[i].THUMWJM) picobj["thumwjm"] = json[i].THUMWJM;//缩略图文件名
//         if(json[i].thumwjm) picobj["thumwjm"] = json[i].thumwjm;//json对象大小写补充
//         if(field.length>0){
//             var zpinfo = "";
//             for(var f=0;f<field.length;f++){
//                 var currfield = field[f];
//                 zpinfo +="<p>"+fieldname[f]+":"+json[i][currfield]+"</p>";
//             }
//             picobj["picinfo"] =zpinfo;
//         }
//         if(picobj["zpwjm"] ==undefined || picobj["zpwjm"] =="") {
//             menuShowDialogTips("当前找到不图片信息");
//             return;
//         }
//         if(picobj["thumwjm"] ==undefined || picobj["zpwjm"] =="") {
//             menuShowDialogTips("当前找到不缩略图信息");
//             return;
//         }
//         picList.push(picobj);
//     }
//     artDialog.data("show_pictype", pictype);
//     artDialog.data("show_picindex", index);
//     artDialog.data("show_piclist", picList);
//     var url ="/imosDemo/publish/auditing/v_viewPic?rnd="+Math.random();
//     //console.log($(window).height()+"  11  "+$(window).width());
//     var width = $(window).width() - 100;//800;
//     var height = $(window).height() - 100;// 600;
//     art.dialog.open(url, {
//         title: title,  width: width, height: height, lock: true, opacity: 0.7,
//     });
// }



//简单HTML内容弹出操作，带回调函数
//needobj 需要传回值的控件
//请注意：如果html含有事件或者函数，那么请一定要在本js文件中定义，因为不是回调函数，无法返回子页面进行处理
function menuShowDialogWithHtml(title, html, width, buttontext, callbackname, needobj) {
    art.dialog({
        title: title,
        lock: true, opacity: 0.7,
        content: html,
        width: width,
        cancel: true,
        padding: '0px 5px 0px 5px',
        button:
            [
                {
                    name: buttontext,
                    callback: function () {
                        var pars = new Array();
                        for (var i = 0; i < needobj.length; i++) {
                            var id = $("#" + needobj[i]);
                            var value = "";
                            if (id.html()) value = id.html();
                            if (id.text()) value = id.text();
                            if (id.val()) value = id.val();
                            pars.push(value);
                        }
                        if (callbackname)
                            callbackname(pars);
                    }
                }
            ]
    });


}





//简单HTML内容弹出操作，带回调函数 无按钮
//needobj 需要传回值的控件
//请注意：如果html含有事件或者函数，那么请一定要在本js文件中定义，因为不是回调函数，无法返回子页面进行处理
function menuShowDialogWithHtmlNoButton(title, html, width, height) {
    art.dialog({
        id:"html_dialog",
        title: title,
        lock: true,
        opacity: 0.7,
        content: html,
        width: width,
        height:height,
        onClose:function () {
            $(this).dialog('destroy');
        }
    });

}

//简单HTML内容弹出操作，带回调函数
//没有标题状态栏
//needobj 需要传回值的控件
//请注意：如果html含有事件或者函数，那么请一定要在本js文件中定义，因为不是回调函数，无法返回子页面进行处理
function menuShowDialogWithHtmlNoCancel(html, width, buttontext, callbackname, needobj) {
    art.dialog({
        title: false,
        lock: true, opacity: 0.7,
        content: html,
        width: width,
        cancel: true,
        padding: '0px 5px 0px 5px',
        button:
            [
                {
                    name: buttontext,
                    callback: function () {
                        var pars = new Array();
                        for (var i = 0; i < needobj.length; i++) {
                            var id = $("#" + needobj[i]);
                            var value = "";
                            if (id.html()) value = id.html();
                            if (id.text()) value = id.text();
                            if (id.val()) value = id.val();
                            pars.push(value);
                        }
                        if (callbackname)
                            callbackname(pars);
                    }
                }
            ]
    });
}

//带回调函数和参数的确认弹出框
function menuShowDialogConfirm(title, text, callbakfuc, callbakpar) {
    art.dialog({
        id: 'Confirm_dialog',
        title: title,
        lock: true, opacity: 0.7,
        content: text,
        cancel: true,
        okVal: '确定',
        ok: function () {
            callbakfuc(callbakpar);
            return true;
        },
        cancelVal: '取消',
        cancel: true
    });
}

//关闭Confirm提示框
function menuConfirmDialogClose() {
    art.dialog({ id: 'Confirm_dialog' }).close();
}

//带回调函数和参数的确认弹出框
//且取消按钮也有回调函数
function menuShowDialogConfirmWithCancelCallback(title, text, callbakfuc, cancelcallbakfuc) {
    art.dialog({
        id: 'userhgmix_dialog',
        title: title,
        lock: true, opacity: 0.7,
        content: text,
        cancel: true,
        button: [
            {
                name: '下载模板',
                focus: true,//按钮高亮
                callback: function () {
                    callbakfuc();
                },
                focus: true
            },
            {
                name: '选择文件',
                callback: function () {

                    cancelcallbakfuc();
                }
            },
            {
                name: '取消',
                //disabled: true，
                callback: function () {
                    return false;
                }
            }
        ]

    });
}

function meneShowdialogConfirm1(content, yesFun, noFun) {
    art.dialog.confirm(content, yesFn, noFn)
}
//不带回调函数和参数的确认弹出框
function menuShowDialogTips(text) {
    art.dialog({
        id:"dg_tips",
        title: '提示',
        lock: true, opacity: 0.7,
        content: text,
        ok: function () {
            return true;
        }
    });
}

//loading 提示框
function menuShowDialogLoading(text) {
    art.dialog({
        id: "dg_loading",
        title: '加载中...',
        cancel:false,
        lock: true, opacity: 0.7,
        content: "<div style='text-align:center'><img src='http://wxapp.whadshel.com/testimos/damei/image/loading_32.gif'></div><div>" + text + "</div>"
    });
}
//关闭loading提示框
function menuLoadingDialogClose() {
    art.dialog({ id: 'dg_loading' }).close();
}
//点击查看图片
function ShowImage(title, imagepath, width, height) {
    art.dialog(
        {
            title: title,
            fixed: true,
            content: '<img width="' + width + '" height="' + height + '" src="' + imagepath + '" />'
        });

}



//获得鼠标点击的横纵坐标
function getMousePos(event,id) {
    var e = event || window.event;
    //var thisX = document.getElementById(id).offsetLeft();
    // var thisY = document.getElementById(id).offsetTop();
    //return {'x':thisX,'y':thisY};
    return {'x':e.clientX,'y':e.clientY}
}

//通过POST的DATA进行传递参数获取JSON
//postdata 示例：[a:'123',b:'321']
function  getJsonWithData(config,postdata) {
    var resultjson = "";
    $.ajax({
        //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
        url: "http://10.20.14.33/ImosInfo/dxgl/data.aspx?config=" + config,
        type: "POST",
        async: false,
        data:postdata,
        dataType: "html",
        success: function (result) {
            var data = eval('(' + result + ')');
            resultjson = data
        },
        error:function (result) {
            resultjson = null;
        }
    });
    return resultjson;
}

//通过URL传递参数获取JSON数据
function  getJsonWithUrl(config,otherpars) {
    var resultjson = "";
    $.ajax({
        //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
        url: config+"?"+otherpars,
        type: "POST",
        async: false,
        dataType: "html",
        success: function (result) {
            var data = eval('(' + result + ')');
            resultjson = data
        },
        error:function (result) {
            resultjson = null;
        }
    });
    return resultjson;
}

//动态创建DIV单选项,选中即隐藏
//divid 为下拉菜单的容器
//json 为该下拉菜单的数据源
//optionkey 为该json中要取值的关键字
function CreatSingleSelect(divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var optionhtml = "";

        $('#'+divid).css({'left':POSx,'top':POSy});
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        for(var i=0;i<json.length;i++){
            optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
        }
        $("#"+divid).html("").append(closehtml).append(optionhtml);
        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
            })
        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                var parentdivid =  $(this).parent().attr("id");
                var inputid  = parentdivid.replace("_div","");
                $("#"+inputid).val($(this).attr("data-val"));
                $(this).parent().hide();
            });
        })
    }
}

function  closeDIV(src) {
    $(this).hide();
}

//动态创建DIV单选项,选中后需要通过确定按钮来赋值
//divid 为下拉菜单的容器
//json 为该下拉菜单的数据源
//optionkey 为该json中要取值的关键字
function CreatSingleSelectWithConfirm(divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var optionhtml = "";

        $('#'+divid).css({'left':POSx,'top':POSy});
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var optioncssname = divid+"_option";
        for(var i=0;i<json.length;i++){
            optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
        }
        $("#"+divid).html("").append(closehtml).append(optionhtml);
        $("#"+divid).on("onmouseout",function(){
            $(this).hide();
        });
        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
            })
        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                var parentdivid =  $(this).parent().attr("id");
                var inputid  = parentdivid.replace("_div","");
                $("#"+inputid).val($(this).attr("data-val"));
            });
        })
    }
}

//动态创建DIV多选项
function  CreatMultiSelect(divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else {
        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var allcssname = divid+"_all";
        var closehtml  ="<div class=\"titlediv\"><div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var allhtml ="<div><a class=\"sort cursor "+allcssname+"\"  data-val=\"全部"+title+"\">全部"+title+"</a></div>";
        var optionhtml = "<div>";
        var optionArr =[];
        for(var i=0;i<json.length;i++){
            if(json[i][optionkey]==null) continue;
            if(optionArr[json[i][optionkey]]) continue;
            optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
            optionArr[json[i][optionkey]] = json[i][optionkey];
        }
        optionhtml+="</div>";
        var confirmhtml ="<div></div>";
        $("#"+divid).html("").append(closehtml).append(allhtml).append(optionhtml);
        $("#"+divid).on("onmouseout",function(){
            $(this).hide();
        });
        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
            })
        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                //event.stopPropagation(); ie9以下不支持
                if (event.stopPropagation) {
                    // 针对 Mozilla 和 Opera
                    event.stopPropagation();
                }
                else if (window.event) {
                    // 针对 IE
                    window.event.cancelBubble = true;
                }
                var parentdivid = $(this).parent().parent().attr("id");
                var inputid = parentdivid.replace("_div", "");
                if($(this).hasClass("typeSelected"))
                {  //已选中时,再次点中时需要取消
                    var selectstr = $("#" + inputid).val();
                    selectstr = selectstr.replace( $(this).attr("data-val")+";","");
                    if(selectstr=="")
                    {//全部取消时，默认为全部选中
                        $("."+allcssname).click();
                    }
                    else {
                        $("#" + inputid).val(selectstr);
                        $(this).removeClass("typeSelected");
                    }
                }
                else
                {
                    $(this).addClass("typeSelected");
                    var alloptionstr ="";
                    var hasselectedoption ="";
                    $("."+optioncssname).each(function () {
                        alloptionstr +=$(this).attr("data-val")+";";
                        if($(this).hasClass("typeSelected"))
                        {
                            hasselectedoption += $(this).attr("data-val")+";";
                        }
                    });
                    //需要将全选样式去掉
                    $("."+allcssname).removeClass("typeSelected");
                    var selectstr = $("#" + inputid).val();
                    if (selectstr != "全部" + title) {
                        selectstr +=$(this).attr("data-val")+";";
                    }
                    else {
                        selectstr = $(this).attr("data-val")+";";
                    }
                    if(hasselectedoption==alloptionstr)
                    {
                        //当全部单选项选中时，默认为全选
                        $("."+allcssname).click();
                    }
                    else {

                        $("#" + inputid).val(selectstr);
                    }

                }
            });
        });
        $("."+allcssname).each(function () {
            $(this).on("click",function () {
                //event.stopPropagation();ie9以下不支持
                if (event.stopPropagation) {
                    // 针对 Mozilla 和 Opera
                    event.stopPropagation();
                }
                else if (window.event) {
                    // 针对 IE
                    window.event.cancelBubble = true;
                }
                $(".typeSelected").removeClass("typeSelected");
                $(this).addClass("typeSelected");
                var parentdivid =  $(this).parent().parent().attr("id");
                var inputid  = parentdivid.replace("_div","");
                $("#"+inputid).val($(this).attr("data-val"));

            });
        });
    }
}


//动态创建DIV多选项---联动下拉菜单操作
//divid,title,json,optionkey     为首选项
//divid1,title1,json1,optionkey1 为次选项
function  CreatMultiTogetherSelect(divid,title,json,optionkey,divid1,title1,json1,optionkey1) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else {
        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var allcssname = divid+"_all";
        var closehtml  ="<div class=\"titlediv\"><div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var allhtml ="<div><a class=\"sort cursor "+allcssname+"\"  data-val=\"全部"+title+"\">全部"+title+"</a></div>";
        var optionhtml = "<div>";
        var optionArr =[];
        for(var i=0;i<json.length;i++){
            if(optionArr[json[i][optionkey]]) continue;
            optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
            optionArr[json[i][optionkey]] = json[i][optionkey];
        }
        optionhtml+="</div>";
        var confirmhtml ="<div></div>";
        $("#"+divid).html("").append(closehtml).append(allhtml).append(optionhtml);
        $("#"+divid).on("onmouseout",function(){
            $(this).hide();
        });
        $("."+closecssname).each(function () {

            $(this).on("click",function () {
                $(this).parent().parent().hide();
            });

        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                //event.stopPropagation();ie9以下不支持
                if (event.stopPropagation) {
                    // 针对 Mozilla 和 Opera
                    event.stopPropagation();
                }
                else if (window.event) {
                    // 针对 IE
                    window.event.cancelBubble = true;
                }
                var parentdivid = $(this).parent().parent().attr("id");
                var inputid = parentdivid.replace("_div", "");
                if($(this).hasClass("typeSelected"))
                {  //已选中时,再次点中时需要取消
                    var selectstr = $("#" + inputid).val();
                    selectstr = selectstr.replace( $(this).attr("data-val")+";","");
                    if(selectstr=="")
                    {//全部取消时，默认为全部选中
                        $("."+allcssname).click();
                        //对联动菜单进行禁用
                        $("#"+divid1.replace("_div","")).attr("disabled","disabled");
                        $("#"+divid1.replace("_div","")).val("全部"+title1);
                    }
                    else {
                        $("#" + inputid).val(selectstr);
                        $(this).removeClass("typeSelected");
                        //对联动菜单进行数据处理
                        $("#"+divid1.replace("_div","")).removeAttr("disabled");
                        if(json1 && json1.length>0) {
                            //需要根据选中项对次选项的结果集进行数据筛选
                            var jsondata = [];
                            for(var l=0;l<json1.length;l++)
                            {
                                if(selectstr.indexOf(json1[l].XZQY)>=0)
                                {
                                    var jsonitem = {"qylm": json1[l].LM}
                                    jsondata.push(jsonitem);
                                }
                            }
                            CreatMultiSelect(divid1, title1, jsondata, "qylm");
                            //同时还要对已选中的次选项中符合首选项的选项进行剔除（好拗口）
                            var secondvalueArr =  $("#"+divid1.replace("_div","")).val().split([';']);
                            var newstring ="";
                            for(var s=0;s<secondvalueArr.length;s++) {
                               if(secondvalueArr[s].indexOf($(this).attr("data-val")+"-")<0)
                               {
                                   if(secondvalueArr[s]!="")
                                   newstring +=secondvalueArr[s]+";";
                               }
                            }
                            $("#"+divid1.replace("_div","")).val(newstring);
                        }
                        else
                            ErrorSelect(divid1);

                    }
                }
                else
                {
                    $(this).addClass("typeSelected");
                    var alloptionstr ="";
                    var hasselectedoption ="";
                    $("."+optioncssname).each(function () {
                        alloptionstr +=$(this).attr("data-val")+";";
                        if($(this).hasClass("typeSelected"))
                        {
                            hasselectedoption += $(this).attr("data-val")+";";
                        }
                    });
                    //需要将全选样式去掉
                    $("."+allcssname).removeClass("typeSelected");
                    var selectstr = $("#" + inputid).val();
                    if (selectstr != "全部" + title) {
                        selectstr +=$(this).attr("data-val")+";";
                    }
                    else {
                        selectstr = $(this).attr("data-val")+";";
                    }
                    if(hasselectedoption==alloptionstr)
                    {
                        //当全部单选项选中时，默认为全选
                        $("."+allcssname).click();
                        //对次选项进行禁用
                        $("#"+divid1.replace("_div","")).attr("disabled","disabled");
                        $("#"+divid1.replace("_div","")).val("全部"+title1);
                    }
                    else {
                        $("#" + inputid).val(selectstr);
                        //对联动菜单进行数据处理
                        $("#"+divid1.replace("_div","")).removeAttr("disabled");
                        if(json1 && json1.length>0) {
                            //需要根据选中项对次选项的结果集进行数据筛选
                            var jsondata = [];
                            for(var l=0;l<json1.length;l++)
                            {
                                if(selectstr.indexOf(json1[l].XZQY)>=0)
                                {
                                    var jsonitem = {"qylm":json1[l].LM}
                                    jsondata.push(jsonitem);
                                }
                            }
                            CreatMultiSelect(divid1, title1, jsondata, "qylm");
                        }
                        else
                            ErrorSelect(divid1);
                    }

                }
            });
        });
        $("."+allcssname).each(function () {
            $(this).on("click",function () {
                //event.stopPropagation();ie9以下不支持
                if (event.stopPropagation) {
                    // 针对 Mozilla 和 Opera
                    event.stopPropagation();
                }
                else if (window.event) {
                    // 针对 IE
                    window.event.cancelBubble = true;
                }
                $(".typeSelected").removeClass("typeSelected");
                $(this).addClass("typeSelected");
                var parentdivid =  $(this).parent().parent().attr("id");
                var inputid  = parentdivid.replace("_div","");
                $("#"+inputid).val($(this).attr("data-val"));
                //对次选项进行禁用
                $("#"+divid1.replace("_div","")).attr("disabled","disabled");
                $("#"+divid1.replace("_div","")).val("全部"+title1);

            });
        });
    }
}

//错误的下拉选择
function  ErrorSelect(divid) {
    var inputid = divid.replace("_div","");
    var closehtml  ="<div>选项错误<div class=\"caneal close fr\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
    var errorhtml ="<div>没有任何可选项</div>";
    $("#"+divid).html("").append(closehtml).append(errorhtml);
    $(".close").each(function () {
        $(this).on("click",function () {
            //event.stopPropagation();ie9以下不支持
            if (event.stopPropagation) {
                // 针对 Mozilla 和 Opera
                event.stopPropagation();
            }
            else if (window.event) {
                // 针对 IE
                window.event.cancelBubble = true;
            }
            $(this).parent().parent().hide();
        })
    });
}
