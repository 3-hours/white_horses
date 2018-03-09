/**
 * Created by huang_hui on 2017-12-6.
 */
jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({ position: 'relative' });
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
                .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
                .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};
//通过URL传递参数设定DIV的选择项目
function  creatOptionWithUrl(config,otherpars,divid,pars) {
    $.ajax({
        //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
        url: config+"?"+otherpars,
        type: "POST",
        dataType: "jsonp",
        success: function (result) {
            if(result.code==0) {
                var data = result.data;
                CreatMultiSelect_self(divid,pars[0],data,pars[1]);
            }
            else
                ErrorSelect_self(divid);
        },
        error:function (result) {
            ErrorSelect_self(divid);
        }
    });
}

//动态创建DIV多选项
function  CreatMultiSelect_self(divid,title,json,optionkey) {
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
            if(title == '灯箱状态'){
                if(json[i][optionkey]== '已拆除' || json[i][optionkey]== '未标注地图' ){
                    optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a><hr>";
                    optionArr[json[i][optionkey]] = json[i][optionkey];
                }else {
                    optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
                    optionArr[json[i][optionkey]] = json[i][optionkey];
                }
            }else {
                optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
                optionArr[json[i][optionkey]] = json[i][optionkey];
            }
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
            $(this).on("click",function (e) {
                e.stopPropagation();
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
            $(this).on("click",function (e) {
                e.stopPropagation();
                $(".typeSelected").removeClass("typeSelected");
                $(this).addClass("typeSelected");
                var parentdivid =  $(this).parent().parent().attr("id");
                var inputid  = parentdivid.replace("_div","");
                $("#"+inputid).val($(this).attr("data-val"));

            });
        });
    }
}

//错误的下拉选择
function  ErrorSelect_self(divid) {
    var inputid = divid.replace("_div","");
    var closehtml  ="<div>选项错误<div class=\"caneal close fr\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
    var errorhtml ="<div>没有任何可选项</div>";
    $("#"+divid).html("").append(closehtml).append(errorhtml);
    $(".close").each(function () {
        $(this).on("click",function (e) {
            e.stopPropagation();
            $(this).parent().parent().hide();
        })
    });
}


//得到地址栏的参数id和key
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}

var userPrivJson = "";//人员角色权限
var userCsManagePriv =false;//人员城市管理权限
var userCsEditPriv  = false;//人员城市修改权限
var userCsViewPriv = false;//人员城市浏览权限
var hasAllCity = false;//是否包含全国
var userid ="";
var hasqyfzmc = true;
var stop=true;//防止在一次ajax读取过程中多次触发事件，造成多次加载内容
$(function () {
    //账户权限
    var Request = new UrlSearch();
    userid = decodeURI(Request.userid);
    //alert(jQuery.Support.Cors);
    $.support.cros =true;
    $.ajax({
        url: window.httplink+"/" +"userpriv?userid="+ encodeURI(userid),
        type: "POST",
        async: false,
        dataType: "jsonp",
        success: function (result) {
            var mydata = result;
            userPrivJson = mydata.data;
            //绑定城市
            $("#option_csm").empty();
            $.ajax({
                //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
                url:  window.httplink+"/" +"option_csm",
                type: "POST",
                async: false,
                dataType: "jsonp",
                success: function (result) {
                    var mydata = result;//eval('(' + result + ')');
                    var cscount =0;
                    //先要判断 userPrivJson中是否包含全国，如果不包含，则需要进行单个城市的添加，否则添加所有城市
                    for(var c=0;c<userPrivJson.length;c++){
                        if(userPrivJson[c].CSM=="全国")
                        {
                            hasAllCity =true;
                            break;
                        }
                    }
                    if(hasAllCity) {
                        for (var i = 0; i < mydata.data.length; i++) {
                            var csm = mydata.data[i].csm;
                            var jc = mydata.data[i].jc;
                            $("#option_csm").append("<option value='" + csm + "' jc='" + jc + "'>" + csm + "</option>");
                        }
                    }
                    else{
                        for(var c=0;c<userPrivJson.length;c++)
                        {
                            var privcity = userPrivJson[c].CSM;//拥有权限的城市
                            if(privcity=="全国") continue;
                            //其实在此处还要判断userPrivJson 是否有重复的城市，但是这个本来就是后台管理的数据，懒得处理了
                            for (var i = 0; i < mydata.data.length; i++) {
                                var csm = mydata.data[i].csm;
                                var jc = mydata.data[i].jc;
                                if(privcity == csm ) {
                                    $("#option_csm").append("<option value='" + csm + "' jc='" + jc + "'>" + csm + "</option>");
                                    cscount++;
                                }
                            }
                        }

                    }
                    if(cscount!=1) {
                        $("#option_csm").prepend("<option value='请选择'>请选择</option>");
                        $("#option_csm option").eq(0).attr("selected", true);
                        $("#cslb").hide();
                        $("#option_csm").show();
                    }
                    else {
                        $("#option_csm").hide();
                        $("#cslb").show().text($("#option_csm").val());
                        $("#option_csm option").eq(0).attr("selected", true);
                        $("#option_xzqy").removeAttr("disabled");
                        $("#option_dxks").removeAttr("disabled");
                        $("#option_qyfz").removeAttr("disabled");
                        $("#bt_query").removeAttr("disabled");
                        $(this).removeClass("errorborder");
                        //重新选择城市之后，需要清除需要指定城市的几个下拉菜单的默认值
                        reset();
                        //所有的权限逻辑冲突全部由SH_DXGL_RYCS 自己控制，前端不做任何冲突检测
                        //什么全国有修改权限，北京只有浏览权限之类的东西，统统不管，只取后面一个
                        //北京又有资料浏览，又有资料管理权限之类的，也不管，取第一个权限
                        //先判断全国权限，再判断具体城市权限，后者权限覆盖前者权限，如果都没有，则没有权限
                        //判断全国权限。
                        if(hasAllCity){
                            //userPrivJson包含全国，此处需要取出全国的qxfl
                            for(var a=0;a<userPrivJson.length;a++) {
                                if(userPrivJson[a].CSM =="全国")
                                {
                                    var qxfl =  userPrivJson[a].QXFL;
                                    switch (qxfl){
                                        case "资料浏览":
                                            userCsManagePriv =false;//人员城市管理权限
                                            userCsEditPriv  = false;//人员城市修改权限
                                            userCsViewPriv = true;//人员城市浏览权限
                                            break;
                                        case "资料修改":
                                            userCsManagePriv =false;//人员城市管理权限
                                            userCsEditPriv  = true;//人员城市修改权限
                                            userCsViewPriv = false;//人员城市浏览权限
                                            break;
                                        case "资料管理":
                                            userCsManagePriv =true;//人员城市管理权限
                                            userCsEditPriv  = false;//人员城市修改权限
                                            userCsViewPriv = false;//人员城市浏览权限
                                            break;
                                    }
                                    break;
                                }
                            }
                        }
                        //判断指定城市的权限
                        var csrow = -1;
                        for (var c = 0; c < userPrivJson.length; c++)
                        {
                            if ($("#option_csm").val() == userPrivJson[c].CSM) {
                                csrow = c;
                                break;//找到该城市对应的权限行
                            }
                        }
                        if(csrow!=-1)
                        {
                            var qxfl = userPrivJson[csrow].QXFL;
                            switch (qxfl) {
                                case "资料浏览":
                                    userCsManagePriv = false;//人员城市管理权限
                                    userCsEditPriv = false;//人员城市修改权限
                                    userCsViewPriv = true;//人员城市浏览权限
                                    break;
                                case "资料修改":
                                    userCsManagePriv = false;//人员城市管理权限
                                    userCsEditPriv = true;//人员城市修改权限
                                    userCsViewPriv = false;//人员城市浏览权限
                                    break;
                                case "资料管理":
                                    userCsManagePriv = true;//人员城市管理权限
                                    userCsEditPriv = false;//人员城市修改权限
                                    userCsViewPriv = false;//人员城市浏览权限
                                    break;
                            }
                        }

                        queryList();
                        loadOptionWithCsm();
                    }

                },
                error:function (result) {

                }
            });
        },
        error:function (result) {
            alert(result);
        }
    });


    $("#option_csm").change(function () {//必须要选择城市才能决定的下拉选项
        if($("#option_csm").val()!="请选择"){
            $("#option_xzqy").removeAttr("disabled");
            $("#option_dxks").removeAttr("disabled");
            $("#option_qyfz").removeAttr("disabled");
            $("#bt_query").removeAttr("disabled");
            $(this).removeClass("errorborder");
            //重新选择城市之后，需要清除需要指定城市的几个下拉菜单的默认值
            reset();
            //所有的权限逻辑冲突全部由SH_DXGL_RYCS 自己控制，前端不做任何冲突检测
            //什么全国有修改权限，北京只有浏览权限之类的东西，统统不管，只取后面一个
            //北京又有资料浏览，又有资料管理权限之类的，也不管，取第一个权限
            //先判断全国权限，再判断具体城市权限，后者权限覆盖前者权限，如果都没有，则没有权限
            //判断全国权限。
            if(hasAllCity){
                //userPrivJson包含全国，此处需要取出全国的qxfl
                for(var a=0;a<userPrivJson.length;a++) {
                    if(userPrivJson[a].CSM =="全国")
                    {
                        var qxfl =  userPrivJson[a].QXFL;
                        switch (qxfl){
                            case "资料浏览":
                                userCsManagePriv =false;//人员城市管理权限
                                userCsEditPriv  = false;//人员城市修改权限
                                userCsViewPriv = true;//人员城市浏览权限
                                break;
                            case "资料修改":
                                userCsManagePriv =false;//人员城市管理权限
                                userCsEditPriv  = true;//人员城市修改权限
                                userCsViewPriv = false;//人员城市浏览权限
                                break;
                            case "资料管理":
                                userCsManagePriv =true;//人员城市管理权限
                                userCsEditPriv  = false;//人员城市修改权限
                                userCsViewPriv = false;//人员城市浏览权限
                                break;
                        }
                        break;
                    }
                }
            }
            //判断指定城市的权限
            var csrow = -1;
            for (var c = 0; c < userPrivJson.length; c++)
            {
                if ($("#option_csm").val() == userPrivJson[c].CSM) {
                    csrow = c;
                    break;//找到该城市对应的权限行
                }
            }
            if(csrow!=-1)
            {
                var qxfl = userPrivJson[csrow].QXFL;
                switch (qxfl) {
                    case "资料浏览":
                        userCsManagePriv = false;//人员城市管理权限
                        userCsEditPriv = false;//人员城市修改权限
                        userCsViewPriv = true;//人员城市浏览权限
                        break;
                    case "资料修改":
                        userCsManagePriv = false;//人员城市管理权限
                        userCsEditPriv = true;//人员城市修改权限
                        userCsViewPriv = false;//人员城市浏览权限
                        break;
                    case "资料管理":
                        userCsManagePriv = true;//人员城市管理权限
                        userCsEditPriv = false;//人员城市修改权限
                        userCsViewPriv = false;//人员城市浏览权限
                        break;
                }
            }
            //$("#bt_query").click();
            queryList();
        }
        else{
            $("#option_xzqy").attr("disabled","disabled");
            $("#option_lm").attr("disabled","disabled");
            $("#option_dxks").attr("disabled","disabled");
            $("#option_qyfz").attr("disabled","disabled");
            $("#bt_query").attr("disabled","disabled");
            reset();
            userCsManagePriv =false;//人员城市管理权限
            userCsEditPriv  = false;//人员城市修改权限
            userCsViewPriv = false;//人员城市浏览权限
            return;
        }
        loadOptionWithCsm();
    });
    //因为跨域问题，IE9不兼容，导致了需要使用jsonp的方式进行处理，但是JSONP必须是异步的方式，所以直接封装成一个调用函数
    //站点方位
    creatOptionWithUrl(window.httplink+"/" +"option_zdfw","","option_zdfw_div",["站点方位","zdfw"]);
    //建造类型
    CreatJzlxSelect();
    //灯箱来源
    creatOptionWithUrl(window.httplink+"/" +"option_dxly","","option_dxly_div",["灯箱来源","dxly"]);
    //销售等级
    creatOptionWithUrl(window.httplink+"/" +"option_ztjb","","option_xsdj_div",["销售等级","jbdm"]);
    //供电方式
    creatOptionWithUrl(window.httplink+"/" +"option_gdfs_query","","option_gdfs_div",["供电方式","gdly"]);
    //站牌状态
    //creatOptionWithUrl(window.httplink+"/" +"option_zpzt","","option_zpzt_div",["灯箱状态","zpzt"]);
    var json_zpzt = [{"zpzt":"新建未审核"},{"zpzt":"新站牌"},{"zpzt":"老站牌"},{"zpzt":"已拆除"},{"zpzt":"已验收"},{"zpzt":"未验收"},{"zpzt":"已标注地图"},{"zpzt":"未标注地图"},{"zpzt":"无修改"},{"zpzt":"已修改待审核"},{"zpzt":"修改审核通过"},{"zpzt":"修改退回"}];
    CreatMultiSelect_self("option_zpzt_div","灯箱状态",json_zpzt,"zpzt");
    //灯箱规格
    creatOptionWithUrl(window.httplink+"/" +"option_ggh","","option_ggh_div",["灯箱规格","ggmc"]);


    // //站点方位
    // var zdfwjson =  getJsonWithUrl(window.httplink+"/" +"option_zdfw","");
    // if(zdfwjson && zdfwjson.code=="0")
    //     CreatMultiSelect("option_zdfw_div","站点方位",zdfwjson.data,"zdfw");
    // else
    //     ErrorSelect("option_zdfw_div");
    //
    // //建造类型
    // CreatJzlxSelect();
    // //灯箱来源
    // var dxlyjson =  getJsonWithUrl(window.httplink+"/" +"option_dxly","");
    // if(dxlyjson && dxlyjson.code=="0")
    //     CreatMultiSelect("option_dxly_div","灯箱来源",dxlyjson.data,"dxly");
    // else
    //     ErrorSelect("option_dxly_div");
    //
    // //销售等级
    // var ztjbjson =  getJsonWithUrl(window.httplink+"/" +"option_ztjb","");
    // if(ztjbjson && ztjbjson.code=="0")
    //     CreatMultiSelect("option_xsdj_div","销售等级",ztjbjson.data,"jbdm");
    // else
    //     ErrorSelect("option_xsdj_div");
    // //供电方式
    // var gdfsjson =  getJsonWithUrl(window.httplink+"/" +"option_gdfs_query","");
    // if(gdfsjson && gdfsjson.code=="0")
    //     CreatMultiSelect("option_gdfs_div","供电方式",gdfsjson.data,"gdly");
    // else
    //     ErrorSelect("option_gdfs_div");
    //
    // //站牌状态
    // var zpztjson =  getJsonWithUrl(window.httplink+"/" +"option_zpzt","");
    // if(zpztjson && zpztjson.code=="0")
    //     CreatMultiSelect("option_zpzt_div","灯箱状态",zpztjson.data,"zpzt");
    // else
    //     ErrorSelect("option_zpzt_div");
    //
    // //灯箱规格
    // var gghjson =  getJsonWithUrl(window.httplink+"/" +"option_ggh","&csm="+encodeURI($("#option_csm").val()));
    // if(gghjson && gghjson.code=="0")
    //     CreatMultiSelect("option_ggh_div","灯箱规格",gghjson.data,"ggmc");
    // else
    //     ErrorSelect("option_ggh_div");


    $(".inputType").each(function () {
       $(this).on("click",function (e) {
            e.stopPropagation();
            if($(this).val()== $(this).attr("default"))
                $(this).val("");
            else if($(this).val().indexOf("|")>=0)
            {//包含高级条件时输入时，
                $("#bt_advanced").addClass("AdvancedClick");
                $(".Advanced").show();
                //需要将输入框中的高级条件剔除
                if($("#input_all").val().indexOf("|")>=0)
                {
                    $("#input_all").val($("#input_all").val().substring(0,$("#input_all").val().indexOf("|")));
                }
            }
       });
       $(this).blur(function () {
           if($(this).val()==""){
               $(this).val($(this).attr("default"));
           }
       });
    });
    $(".selectType").each(function () {
        var id = $(this).attr("id");
        var divid = id+"_div";
        $(this).on("click",function (e) {
            e.stopPropagation();
            var thisX = $('#'+id).position().left;
            var thisY = $('#'+id).position().top;
            var POSx = thisX;
            var POSy = parseInt(thisY) + 30;
            $('#'+divid).css({'left':POSx,'top':POSy});
            $(".sortWrapper").hide();
            //显示选项对应的DIV
            $("#"+divid).show();
            var inputvalue = $(this).val();
            $("#"+divid).find("a").each(function () {
                if(inputvalue.indexOf($(this).attr("data-val"))>=0)
                {
                    $(this).addClass("typeSelected");
                }
                else{
                    $(this).removeClass("typeSelected");
                }
            });
        });


    });

    $("#bt_advanced").click(function () {
        if($(this).hasClass("AdvancedClick")) {
            $(this).removeClass("AdvancedClick");
            $(".Advanced").hide();
            //需要将高级条件中的选择项目显示在输入框中\
            var advanceStr="";
            var inputvalue = $("#input_all").val();
            if(inputvalue=="请输入查询关键字 用空格分隔进行模糊查询") inputvalue ="";
            if($("#input_all").val().indexOf("|")>=0)
            {
                $("#input_all").val($("#input_all").val().substring(0,$("#input_all").val().indexOf("|")));
            }
            var optionArr = ["#option_xzqy","#option_lm","#option_zdfw","#option_jzlx","#option_ggh","#option_dxks","#option_xsdj","#option_gdfs","#option_zpzt","#option_qyfz","#option_dxly"];
            for(var i=0;i<optionArr.length;i++)
            {
                if($(optionArr[i]).val().indexOf("全部")<0)
                {
                    advanceStr += "|" + $(optionArr[i]).val();
                }
            }
            $("#input_all").val(inputvalue+advanceStr);
            $("#tablediv").removeClass("tablediv1").addClass("tablediv");
        }
        else{
            $(this).addClass("AdvancedClick");
            $(".Advanced").show();
            //需要将输入框中的高级条件剔除
            if($("#input_all").val().indexOf("|")>=0)
            {
                $("#input_all").val($("#input_all").val().substring(0,$("#input_all").val().indexOf("|")));
            }

            $("#tablediv").removeClass("tablediv").addClass("tablediv1");
        }
    });

    $("#bt_clear").click(function () {
        reset();
    });
    //动态获取灯箱列表数据，根据userid 进行服务器缓存
    //每次点击查询，都将会更新对应userid主键的缓存
    //首次请求（按钮点击查询）缓存后直接返回该缓存产生的HTML，产生的TABLE id=dxlbTable
    //后续请求（滚动条滚到底）返回数据时，将直接返回<TR>行数据，需要往dxlbTable这个对象中直接APPEND即可
    //首次请求和后续请求，每次都只返回10行站亭数据
    $("#bt_query").click(function () {
        stop =false;
        queryList();
    });


    $(window).scroll(function(){
        //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度，
        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置，
        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
        //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
        if(scrollTop+clientHeight==htmlHeight){
            if(stop==true){
                stop=false;
                var count =jsondata.count;
                $.ajax({
                    url:  window.httplink+"/" +"dxlb_more",
                    data:{
                        "userid":userid,
                        "dataid":dataid,
                        "start":count
                    },
                    type: "POST",
                    dataType: "json",
                    success: function (data) {
                        if(data.ztkeys.length>0) {
                            buildList(data,newqueryRnd,data.count,null);//buildFirstComplet
                            stop=true;
                        }
                        else{
                            $("#dxlbTable").append("<tr><td colspan='17' style='text-align: center;font-size:14px;color: red'>没有更多数据了</td></tr>")
                        }
                    },
                    error:function (result) {
                        stop=true;
                    }
               });
            }
        }
    });

    $(document).mouseup(function(e){
        var _con = $('.absolute_box');   // 设置目标区域
        if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            $('.absolute_box').hide();
        }
        var _con = $('#dxlbTable');   // 设置目标区域
        if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            $('#leftmouse_Menu').hide();
        }
        if (3 == e.which) {
            $('#leftmouse_Menu').hide();
        }
    });


});


function  loadOptionWithCsm() {
    //使用jsonp方式获取数据,而不能使用已经注释的代码
    //行政区域 (由于行政区域和路名为联动选择，所以需要先把所有路名查询出来，然后根据具体的行政区域进行筛选)
    var xzqyjson = '';
    $.ajax({
        url: window.httplink+"/" +"option_xzqy"+"?"+"&csm="+encodeURI($("#option_csm").val()),
        type: "POST",
        dataType: "jsonp",
        success: function (result) {
            xzqyjson =  result;
            if(xzqyjson && xzqyjson.code=="0"){
                //路名
                var lmjson = '';
                $.ajax({
                    url: window.httplink+"/" +"option_lm"+"?"+"&csm="+encodeURI($("#option_csm").val()),
                    type: "POST",
                    dataType: "jsonp",
                    success: function (result) {
                        lmjson =  result;
                        if(lmjson && lmjson.code=="0"){
                            CreatMultiTogetherSelect("option_xzqy_div","行政区域",xzqyjson.data,"xzqy","option_lm_div","路名",lmjson.data,"LM");
                        }else{
                            ErrorSelect("option_dxks_div");
                        }
                    },
                    error:function (result) {
                        alert(result.msg);
                    }
                });
            }

        },
        error:function (result) {
            alert(result.msg);
        }
    });
    //var xzqyjson =  getJsonWithUrl(window.httplink+"/" +"option_xzqy","&csm="+encodeURI($("#option_csm").val()));
    //var lmjson =  getJsonWithUrl(window.httplink+"/"+"option_lm","&csm="+encodeURI($("#option_csm").val()));
    //if(xzqyjson && xzqyjson.code=="0")
       // CreatMultiTogetherSelect("option_xzqy_div","行政区域",xzqyjson.data,"xzqy","option_lm_div","路名",lmjson.data,"LM");
    //else
       // ErrorSelect("option_xzqy_div");
    //灯箱款式
    $.ajax({
        //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
        url: window.httplink+"/" +"option_dxks"+"?"+"&csm="+encodeURI($("#option_csm").val()),
        type: "POST",
        dataType: "jsonp",
        success: function (result) {
            var dxksjson = result;
            if(dxksjson && dxksjson.code=="0")
                CreatMultiSelect("option_dxks_div","灯箱款式",dxksjson.data,"ksmc");
            else
                ErrorSelect("option_dxks_div");
        },
        error:function (result) {
            alert(result.msg);
        }
    });
   /* var dxksjson =  getJsonWithUrl(window.httplink+"/" +"option_dxks","&csm="+encodeURI($("#option_csm").val()));
    if(dxksjson && dxksjson.code=="0")
        CreatMultiSelect("option_dxks_div","灯箱款式",dxksjson.data,"ksmc");
    else
        ErrorSelect("option_dxks_div");*/
    //区域分组
    $.ajax({
        //url: "http://10.20.14.33/crmInfo/damei/RequestData.aspx?config="+optionname,
        url: window.httplink+"/" +"option_qyfz"+"?"+"&csm="+encodeURI($("#option_csm").val()),
        type: "POST",
        dataType: "jsonp",
        success: function (result) {
            var qyfzjson = result;
            if(qyfzjson && qyfzjson.code=="0")
            //并不是所有城市都有区域分组。只有当dxksjson.data有数时，才显示该控件
                if(qyfzjson.data.length>0) {
                    hasqyfzmc = true;
                    $("#option_qyfz").show();
                    CreatMultiSelect("option_qyfz_div", "区域分组", qyfzjson.data, "fzmc");
                }
                else {
                    hasqyfzmc = false;
                    $("#option_qyfz").hide();
                }
            else
                ErrorSelect("option_qyfz_div");
        },
        error:function (result) {
            alert(result.msg);
        }
    });
  /*  var qyfzjson =  getJsonWithUrl(window.httplink+"/" +"option_qyfz","&csm="+encodeURI($("#option_csm").val()));
    if(qyfzjson && qyfzjson.code=="0")
    //并不是所有城市都有区域分组。只有当dxksjson.data有数时，才显示该控件
        if(qyfzjson.data.length>0) {
            hasqyfzmc = true;
            $("#option_qyfz").show();
            CreatMultiSelect("option_qyfz_div", "区域分组", qyfzjson.data, "fzmc");
        }
        else {
            hasqyfzmc = false;
            $("#option_qyfz").hide();
        }
    else
        ErrorSelect("option_qyfz_div");*/
}

function  reset() {

    var optionArr = ["#option_xzqy","#option_lm","#option_zdfw","#option_jzlx","#option_ggh","#option_dxks","#option_xsdj","#option_gdfs","#option_zpzt","#option_qyfz","#option_dxly"];
    for(var i=0;i<optionArr.length;i++)
    {
        $(optionArr[i]).val($(optionArr[i]).attr("default"));
    }
    $("#option_lm").attr("disabled","disabled");
    $("#input_all").val($("#input_all").attr("default"));
}


//建造类型
function CreatJzlxSelect() {
    var optioncssname = "option_jzlx_option";
    var closecssname = "option_jzlx_close";
    var allcssname = "option_jzlx_all";
    var optionneedsubcssname ="option_jzlx_needsub_option";//需要次级选项的选项
    var allsubcssname = "option_jzlx_sub_all";//次级全选
    var optionsubcssname =  "option_jzlx_sub_option";//次级选项
    var closehtml  ="<div class=\"titlediv\"><div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
    var allhtml ="<div><a class=\"sort cursor "+allcssname+"\"  data-val=\"全部建造类型\">全部建造类型</a></div>";
    var optionhtml = "<div>";
    optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val='自建'>自建</a>";
    optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val='改造'>改造</a>";
    optionhtml +="<a class=\"sort cursor  " +optioncssname+"\"  data-val='收购' sub='option_jzlx_sub_div_sg'>收购</a>";
    optionhtml +="<a class=\"sort cursor " +optioncssname+"\"  data-val='租用' sub='option_jzlx_sub_div_zy'>租用</a>";
    optionhtml +="<a class=\"sort cursor " +optioncssname+"\"  data-val='代理' sub='option_jzlx_sub_div_dl'>代理</a>";
    optionhtml+="</div>";
    optionhtml +="<div>";
    $("#option_jzlx_div").html("").append(closehtml).append(allhtml).append(optionhtml);
    $("."+closecssname).each(function () {
        $(this).on("click",function () {
            $(this).parent().parent().hide();
        })
    });
    //建造类型菜单点击
    $("."+optioncssname).each(function () {
        $(this).on("click",function () {
            var parentdivid = "option_jzlx_div";
            var inputid = "option_jzlx";
            if($(this).hasClass("typeSelected"))
            {   //已选中时,再次点中时需要取消
                var selectstr = $("#" + inputid).val();
                var valuearr = selectstr.split(";");
                var valuearrnew =[];
                for(var i=0;i<valuearr.length;i++)
                {
                    if(valuearr[i].indexOf($(this).attr("data-val"))<0)
                    {
                        valuearrnew.push(valuearr[i]);
                    }
                }
                selectstr = valuearrnew.join(";");
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
                       hasselectedoption += $(this).attr("data-val") + ";";
                    }
                });
                //需要将全选样式去掉
                $("."+allcssname).removeClass("typeSelected");
                var selectstr = $("#" + inputid).val();
                if (selectstr != "全部建造类型") {
                    selectstr +=$(this).attr("data-val")+";";
                }
                else {
                    selectstr = $(this).attr("data-val")+";";
                }
                //最后判断是否全部选项被选中的情况
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
    //灯箱来源菜单的选项
    $("."+optionsubcssname).each(function () {
        $(this).on("click",function () {

        });
    });
    //一级菜单全选
    $("."+allcssname).each(function () {
        $(this).on("click",function () {
            $(".typeSelected").removeClass("typeSelected");
            $(this).addClass("typeSelected");
            var parentdivid =  $(this).parent().parent().attr("id");
            var inputid  = parentdivid.replace("_div","");
            $("#"+inputid).val($(this).attr("data-val"));

        });
    });
}
//封装可视区宽度
var clientW = function(){
    return document.documentElement.clientWidth || document.body.clientWidth;
};
//封装可视区高度
var clientH = function(){
    return document.documentElement.clientHeight||document.body.clientHeight;
};
//封装滚动条高度
var scrollT = function () {
    return document.body.scrollTop||document.documentElement.scrollTop;
}

//链接点击事件
function showztDetail(src) {
    //event.stopPropagation();//阻止行点击事件的触发
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey]
    var zpobj  = ztobj.zps[zpkey];
    var url = "pageRedirect.aspx" ;
    var ztbh =ztobj.ztbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztobj", ztobj);
    artDialog.data("post_zpobj","zpobj");
    artDialog.data("post_hasqyfzmc", hasqyfzmc);
    menuShowdialogWithPars(url,"",ztbh+"站点详细信息",960,520,"&config=ztdetail",null,null);
}
//验收信息点击
function showYsInfo(src) {
    //event.stopPropagation();//阻止行点击事件的触发
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var url = "pageRedirect.aspx" ;
    var zpbh  = zpobj.zpbh;
    var zpid = zpobj.zp_id;
    var privstr =userCsEditPriv?"1":"0";
    // artDialog.data("post_zpid", zpid);
    // artDialog.data("post_csm", $("#option_csm").val());
    // artDialog.data("post_userid", userid);
    // menuShowdialogWithPars(url,"",zpbh+"验收信息",800,380,"&config=zpysxx"+otherpars,null,null);
    //为了兼容其他页面，使用地址传值
    var otherpars = "&city="+encodeURI( $("#option_csm").val())+"&userid="+encodeURI(userid)+"&zpid="+zpid+"&priv="+privstr;
    menuShowdialogWithPars(url,"",zpbh+"验收信息",1100,320,"&config=checkaudit"+otherpars,null,null);

}
//地图标注点击
function showBzInfo(src) {
    //event.stopPropagation();//阻止行点击事件的触发
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var url = "pageRedirect.aspx" ;
    var ztbh  = ztobj.ztbh;
    var privstr =userCsEditPriv?"1":"0";
    // artDialog.data("post_csm", $("#option_csm").val());
    // artDialog.data("post_userid", userid);
    // artDialog.data("post_ztobj",ztobj);
    // artDialog.data("post_priv", privstr);//地图标注权限
    var otherpars = "&city="+encodeURI( $("#option_csm").val())+"&userid="+encodeURI(userid)+"&priv="+privstr+"&ztbh="+encodeURI(ztbh);
    menuShowdialogWithPars(url,"",ztbh+"地图标注",800,520,"&config=zpdtbz"+otherpars,null,null);

    // //为了兼容其他页面，使用地址传值
    // var otherpars = "&userid="+encodeURI(url)+"&zpid="+ztobj.zpid;
    // menuShowdialogWithPars(url,"",ztobj.ztbh+"地图标注",800,520,"&config=zpdtbz",null,null);

}
//避免NULL值
function checkNull(returnvalue,defaultvalue) {
    if(returnvalue)
        return returnvalue;
    else return defaultvalue;
}

//行点击事件
function  trcomboclick(src) {

    $("#leftmouse_Menu").html("");
    var scrollTop= scrollT();
    var windowHeight= $(window).height();
    var windowWidth  = $(window).width();
    var clicktop = event.clientY ;
    var clickleft = event.clientX ;
    if(clickleft+120 > windowWidth){
        //点击位置+窗口宽度已经超出当前可视，则使用windowWidth-120
        clickleft = windowWidth -120;
    }
    if(clicktop + 150 >windowHeight)
        clicktop = windowHeight -150;
    $("#leftmouse_Menu").css({"top":clicktop+ "px","left":clickleft+ "px"});
    /* 菜单栏目
     //基本样式
     <li><a href="javascript:void(0);">测试1</a></li>
     <li><a>测试2</a></li>
     //权限控制(根据userid的权限，显示不同的菜单、同时还要判断)
     站牌审核	资料管理
     地址标签	资料管理
     分类标签	资料管理
     销售调级	资料管理
     修改属性	资料修改
     修改地址	资料修改
     拆除灯箱	资料修改
     拆除站点	资料修改
     站牌通电	资料修改
     站牌长停	资料修改
     新增灯箱	资料修改
     新增站点	资料修改
     设同站	    资料修改
     //状态控制
     */
    //左键菜单有超出可视区域的BUG，等待修复


    //修改为从Window.data 中取数据
    var ztkey  =  $(src).attr("ztkey");
    var zpkey  =  $(src).attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var optionhtml ="";
    if(userCsManagePriv)
    {//资料管理权限
        if(ztobj.xgzt=="待审") {
            optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"ztAudit(this)\">站点审核</a></li>";
        }
        else
        {
            //以下三项需要在产生正式ZP_ID后才出现
            if (zpobj.zp_id && zpobj.zp_id != "" && ztobj.kfzt_code != "删除") {
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpdzLMark(this)\">地址标签</a></li>";
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpflLMark(this)\">分类标签</a></li>";
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpxstjEdit(this)\">销售调级</a></li>";
            }
        }
    }
    if(userCsEditPriv)
    {//资料修改权限
        optionhtml+=" <li><a href=\"javascript:void(0);\"   onclick=\"zdAdd()\">新增站点</a></li>";
        if(ztobj.kfzt_code!="删除") {//站亭非删除状态下允许进行操作
            optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpAdd(this)\">新增灯箱</a></li>";
            if((zpobj.zpbh != null && zpobj.zpbh != "")) {//站牌编号为空时，不允许以下操作操作.此处不用zpid做判断，是因为可能存在新建灯箱还没有ZPID的情况。
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpsxEdit(this)\">修改属性</a></li>";
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"ztdzEdit(this)\">修改地址</a></li>";
                if ((zpobj.tdrq == null || zpobj.tdrq == "") && (zpobj.tdrq_fgs == null || zpobj.tdrq_fgs == ""))
                    optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zptdEdit(this)\">灯箱通电</a></li>";

                 //optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpctEdit(this)\">站牌长停</a></li>"; //暂时先不做
                 //optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"zpstzEdit(this)\">设同站</a></li>";//暂时先不做
                 //optionhtml += " <li><a href=\"javascript:void(0);\"   onclick=\"lsccEdit(this)\">临时拆除</a></li>";//暂时先不做
            }
        }

        if((zpobj.zpscrq_fgs ==null|| zpobj.zpscrq_fgs=="") && zpobj.zpbh!=null && zpobj.zpbh!="") //加上trjson.zpbh!="" 是因为该行可能是站牌已经被拆除的行
        {
            if(zpobj.zp_id!=null && zpobj.zp_id!="" && ztobj.kfzt_code!="删除") {//有正式站牌数据
                optionhtml += " <li><a href=\"javascript:void(0);\"   onclick=\"zpccEdit(this)\">拆除灯箱</a></li>";
            }
            else if(zpobj.zp_id ==null || zpobj.zp_id =="")//新建的拆除
                optionhtml += " <li><a href=\"javascript:void(0);\"   onclick=\"zpccEdit(this)\">拆除灯箱</a></li>";
        }
        // if((trjson.zp_id && trjson.zp_id!="" && trjson.kfzt_code!="删除")|| (trjson.scrq_fgs ==null|| trjson.scrq_fgs==""))
        //     optionhtml += " <li><a href=\"javascript:void(0);\"   onclick=\"zpccEdit(this)\">拆除灯箱</a></li>";
        if(ztobj.ztscrq_fgs ==null  || ztobj.ztscrq_fgs =="") {
            //遍历站点下的所有站牌,如果所有站牌状态都是7,则显示拆除站点的按钮
            var zp_del_zt = false;
            $.each(ztobj.zps, function (index,item) {
                if(item.zyzt == '7'){
                    zp_del_zt = true;
                }else {
                    zp_del_zt = false;
                }
            });
            if( zp_del_zt){
                optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"ztccEdit(this)\">拆除站点</a></li>";
            }
            //if (ztobj.zt_id!="" && (zpobj.zpbh == null || zpobj.zpbh == "") && ztobj.kfzt_code != "删除")//已有数据时的拆除
                //optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"ztccEdit(this)\">拆除站点</a></li>";//拆除站点，需要在所有灯箱都已经拆除的情况下才允许操作
            //else if((ztobj.zt_id==null || ztobj.zt_id=="") && (zpobj.zpbh_fgs == null || zpobj.zpbh == "") ) //新建时候的拆除
                //optionhtml += " <li><a href=\"javascript:void(0);\"  onclick=\"ztccEdit(this)\">拆除站点</a></li>";//拆除站点，需要在所有灯箱都已经拆除的情况下才允许操作
        }
    }
    $("#leftmouse_Menu").append(optionhtml);
    $("#leftmouse_Menu").attr("ztkey",ztkey);
    $("#leftmouse_Menu").attr("zpkey",zpkey);
    //当菜单没有任何选项时不显示
    if(optionhtml!="")
    $("#leftmouse_Menu").show();
    //点击菜单选项时候，隐藏菜单
    $("#leftmouse_Menu").find("a").click(function () {
        $("#leftmouse_Menu").hide();
    });
}

//新增站点
function zdAdd()
{
   var csm = $("#option_csm").val();
   var jc = $("#option_csm").find("option:selected").attr("jc");
   var url = "pageRedirect.aspx" ;
   artDialog.data("post_csm", csm);
   artDialog.data("post_userid",userid);
   artDialog.data("post_jc", jc);
   menuShowdialogWithPars(url,"",csm+"新增站点",850,550,"&config=new_zt",null,null);
   //不需要回调，不需要显示新增到页面
}

//新增灯箱  ztzpjson 数据中包含该站亭的站牌数量。需要进行处理后
function zpAdd(src)
{
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var url = "pageRedirect.aspx" ;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztobj", ztobj);
    menuShowdialogWithPars(url,"",ztbh+"新增灯箱",850,550,"&config=new_zp",null,null);
}

// function zpAddCallBak(pars) {
//     var oldkey = pars;
//     var ztkey = oldkey[1];
//     //麻蛋的。。。因为在新增灯箱可能会保存多个。。。
//     var currzpkey = oldky[0];//为啥要传这个ZPKEY呢，因为可能涉及到新增灯箱，需要在指定行下面APPEND一行，其他的循环ZTOBJ里面的即可
//     var modifyState = art.dialog.data("return_modifyState");
//     if (modifyState == true) {
//
//     }
// }

//修改站牌属性
function zpsxEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var url = "pageRedirect.aspx" ;
    var zpbh = zpobj.zpbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztkey", ztkey);
    artDialog.data("post_zpkey", zpkey);
    artDialog.data("post_ztobj", ztobj);
    artDialog.data("post_zpobj", zpobj);
    menuShowdialogWithPars(url,"",zpbh+"修改属性",700,400,"&config=xgsx",zpsxEditCallbak,[ztkey,zpkey]);
}
//站牌属性修改回调
function zpsxEditCallbak(pars) {
    var ztkey = pars[0];
    var zpkey = pars[1];
    var modifyState = art.dialog.data("return_modifyState");

    if(modifyState ==true) {
        //进行站牌属性修改后的值回填
        var newdata   = art.dialog.data("return_data");
        var newpklist = art.dialog.data("return_pklist");
        var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
        var oldztkey = newjson[0];
        var oldzpkeylist = newjson[1];
        var newztkey = newjson[2];
        var newzpkeylist = newjson[3];
        var ztobj = jsondata[newztkey];
        zpsxEditTrHtml(oldztkey,oldzpkeylist,newztkey,newzpkeylist);
    }
}
//修改属性的行HTML变更
function zpsxEditTrHtml(ztkey,zpkeylist,newztkey,newzpkeylist)
{
    for(var i=0;i<zpkeylist.length;i++)
    {
        var trid = zpkeylist[i]+"_"+ ztkey;
        var newzpkey = newzpkeylist[i];
        var ztobj = jsondata[newztkey];
        var zpobj = ztobj.zps[newzpkey];
        var wzph = "";var dxcx ="";var zpbh="";var ggh ="";
        if(zpobj.wzph_fgs && zpobj.wzph_fgs!="") wzph = zpobj.wzph_fgs;
        else wzph = zpobj.wzph;
        if(zpobj.dxcx_fgs && zpobj.dxcx_fgs!="") dxcx = zpobj.dxcx_fgs;
        else dxcx = zpobj.dxcx;
        if(zpobj.zpbh_fgs && zpobj.zpbh_fgs!="") zpbh = zpobj.zpbh_fgs;
        else zpbh = zpobj.zpbh;
        if(zpobj.ggh_fgs && zpobj.ggh_fgs!="") ggh = zpobj.ggh_fgs;
        else ggh = zpobj.ggh;
        $("#" + trid).find("td").eq(5).html(wzph + "<br/>" + dxcx);//位置，朝向
        $("#" + trid).find("td").eq(6).html(zpbh + "<br/>" + ggh);//规格
        var dxjzfs=""; var dxly="";var dxqs="";var dxjzfsstr = "";
        if(zpobj.dxjzfs_fgs && zpobj.dxjzfs_fgs!="") dxjzfs = zpobj.dxjzfs_fgs;
        else dxjzfs = zpobj.dxjzfs;
        if(zpobj.dxly_fgs&&zpobj.dxly_fgs!="") dxly = zpobj.dxly_fgs;
        else dxly = zpobj.dxly;
        if(zpobj.dxqs_fgs && zpobj.dxqs_fgs!="") ggh = zpobj.dxqs_fgs;
        else dxqs = zpobj.dxqs;
        if (dxjzfs == "自建")
            dxjzfsstr = dxjzfs;
        else {
            var dxlystr = dxly==""?dxly: "无来源";
            if (dxqs != "") dxqs = "/" + dxqs;//避免出现灯箱权属为空时候只显示/
            dxjzfsstr = dxjzfs + "<br/>" + dxly + dxqs;
        }
        $("#" + trid).find("td").eq(7).html(dxjzfsstr);//建造类型

        var ksmc = "";var dxlx ="";
        if(zpobj.ksmc_fgs && zpobj.ksmc_fgs!="") ksmc = zpobj.ksmc_fgs;
        else ksmc = zpobj.ksmc;
        if(zpobj.dxlx_fgs && zpobj.dxlx_fgs!="") dxlx = zpobj.dxlx_fgs;
        else dxlx = zpobj.dxlx;
        if(ksmc=="") ksmc = "未定义款式";
        $("#" + trid).find("td").eq(8).html(ksmc + "<br/>" + dxlx);//常规属性
        var tssx = "";zpobj.zpzt_fgs == "滚动" ? "滚动" : "";
        var dmdx = "";var zpzt ="";
        if(zpobj.zpzt_fgs && zpobj.zpzt_fgs!="") zpzt = zpobj.zpzt_fgs;
        else zpzt = zpobj.zpzt;
        if(zpobj.dmdx_fgs && zpobj.dmdx_fgs!="") dmdx = zpobj.dmdx_fgs;
        else dmdx = zpobj.dmdx;
        if(zpzt!="滚动") zpzt="";
        $("#" + trid).find("td").eq(9).html(dmdx + "<br>" + zpzt);//特殊属性

        var dxtdfs ="";var tdrq ="";
        if(zpobj.dxtdfs_fgs && zpobj.dxtdfs_fgs!="") dxtdfs =zpobj.dxtdfs_fgs;
        else dxtdfs = zpobj.dxtdfs;
        if(zpobj.tdrq_fgs && zpobj.tdrq_fgs!="") tdrq = zpobj.tdrq_fgs;
        else tdrq = zpobj.tdrq;
        if(tdrq!="" && dxtdfs=="") dxtdfs = "未设置供电方式";
        $("#" + trid).find("td").eq(10).html(dxtdfs + "<br>" + tdrq);//通电类型

        if ($("#" + trid).hasClass("greenColor")) $("#" + trid).removeClass("greenColor");
        $("#" + trid).addClass("redColor");

        //变更TRID 以及 ZPKEY ZPKEY
        $("#" + trid).removeAttr("zpkey").attr("zpkey", newzpkey);
        $("#" + trid).removeAttr("ztkey").attr("ztkey", newztkey);
        $("#" + trid).attr("id", newzpkey + "_" + newztkey);

    }
}

//修改站亭地址
function ztdzEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var url = "pageRedirect.aspx" ;
    var zpbh = zpobj.zpbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztkey", ztkey);
    artDialog.data("post_zpkey", zpkey);
    artDialog.data("post_ztobj", ztobj);
    artDialog.data("post_zpobj", zpobj);
    menuShowdialogWithPars(url,"",ztbh+"修改地址",700,300,"&config=xgdz",ztdzEditCallbak,[ztkey,zpkey]);
}

//站亭地址修改回调
function ztdzEditCallbak(pars) {
    var ztkey = pars[0];
    var zpkey = pars[1];
    var modifyState = art.dialog.data("return_modifyState");

    if(modifyState ==true) {
        //进行站亭地址修改后的值回填
        var newdata = art.dialog.data("return_data");
        var newpklist = art.dialog.data("return_pklist");
        var newjson = modifZtJsonData(ztkey,newdata,newpklist);
        var oldztkey = newjson[0];
        var oldzpkeylist = newjson[1];
        var newztkey = newjson[2];
        var newzpkeylist = newjson[3];
        var ztobj = jsondata[newztkey];
        for(var i=0;i<oldzpkeylist.length;i++)
        {
            var trid = oldzpkeylist[i]+"_"+ oldztkey;
            var newzpkey = newzpkeylist[i];
            var zpobj = ztobj.zps[newzpkey];
            //修改HTML
            var zm ="";var xzqy ="";var lm ="";var zdfw="";var fjbzw="";
            if(ztobj.zm_fgs && ztobj.zm_fgs!="") zm = ztobj.zm_fgs;
            else zm = ztobj.zm;
            if(ztobj.xzqy_fgs && ztobj.xzqy_fgs!="") xzqy = ztobj.xzqy_fgs;
            else xzqy = ztobj.xzqy;
            if(ztobj.lm_fgs && ztobj.lm_fgs!="") lm = ztobj.lm_fgs;
            else lm = ztobj.lm;
            if(ztobj.zdfw_fgs && ztobj.zdfw_fgs!="") zdfw= ztobj.zdfw_fgs;
            else zdfw = ztobj.zdfw;
            if(ztobj.fjbzw_fgs && ztobj.fjbzw_fgs!="") fjbzw= ztobj.fjbzw_fgs;
            else fjbzw= ztobj.fjbzw;
            var qyfzmc = "";
            if(ztobj.qyfzmc!=null && ztobj.qyfzmc!="" )
                qyfzmc =ztobj.qyfzmc;
            else qyfzmc = "未分组";
            $("#" + trid).find("td").eq(1).html("<a href='javascript:void(0)'  onclick='showztDetail(this)'>"+ztobj.ztbh +"<br/>"+zm+"</a>");
            $("#" + trid).find("td").eq(2).html(xzqy+"<span style='qyfzmcspan'>("+qyfzmc+")</span><br/>"+lm+"("+zdfw+")");
            $("#" + trid).find("td").eq(3).html(fjbzw);

            if ($("#" + trid).hasClass("greenColor")) $("#" + trid).removeClass("greenColor");
            $("#" + trid).addClass("redColor");

            //变更TRID 以及 ZPKEY ZPKEY
            $("#" + trid).attr("zpkey",newzpkey);
            $("#" + trid).attr("ztkey",newztkey);
            $("#" + trid).attr("id",newzpkey+"_"+newztkey);


        }
        if(!hasqyfzmc) $(".qyfzmcspan").hide();
        //zpsxEditTrHtml(trid, newztkey, newzpkey);
    }

}

//站牌通电
function zptdEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var url = "pageRedirect.aspx" ;
    var zpbh = zpobj.zpbh;
    var ztpk = "";
    if(ztobj.zt_pk_fgs) {
        ztpk = ztobj.zt_pk_fgs;
    }else if(ztobj.zt_pk){
        ztpk = ztobj.zt_pk;
    }
    var ztid = "";
    if(ztobj.zt_id_fgs){
        ztid = ztobj.zt_id_fgs;
    }else if(ztobj.zt_id){
        ztid = ztobj.zt_id;
    }
    var zpid = "";
    if(zpobj.zp_id_fgs){
        zpid = zpobj.zp_id_fgs;
    }else if(zpobj.zp_id){
        zpid = zpobj.zp_id;
    }
    var zppk = "";
    if(zpobj.zp_pk_fgs){
        zppk = zpobj.zp_pk_fgs;
    }else if(zpobj.zp_pk){
        zppk = zpobj.zp_pk;
    }
    var tdrq = "";
    if(zpobj.tdrq_fgs) tdrq = zpobj.tdrq_fgs;
    else tdrq = zpobj.tdrq;
    //站亭级别的json
    var tdfsjson =  getJsonWithUrl(window.httplink+"/" +"option_gdfs","");
    var xs_data = tdfsjson.data;
    var len = xs_data.length;
    var optionhtml = '';
    for(var i=0;i<len;i++) {
        if(xs_data[i].gdly =="未通电") continue;//既然是设定站牌通电，选啥未通电
        optionhtml += '<span class="btn_s" style="display:block;width:150px;height:24px;text-align:center;background:#dddddd;margin-bottom:10px;cursor:pointer;">'+ xs_data[i].gdly +'</span>';
    }
    var html_content = optionhtml;
    html_content +="<div style='padding: 5px 5px 5px 5px;'><input type='text' id='txt_tdrq' class='Wdate' onclick='showRq()' value='"+tdrq+"'> </div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_setdz' value='确认通电'> </div>";
    menuShowDialogWithHtmlNoButton(zpbh+"灯箱通电设置",html_content,230,280);
    //给已选的通电方式加上背景色
    //没有意义，已通电的站牌不允许再进行设置通电
    // $('span').each(function () {
    //     if( $(this).text() == trjson.dxtdfs ){
    //         $(this).addClass("typeSelected");
    //         $(this).css({'background-color':'#3199f3'});
    //     }
    // })

    $('.btn_s').on('click',function () {
        $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
        $(this).css({'background-color':'#3199f3'}).siblings().css({'background-color':'#dddddd'});
    });
    $('#bt_setdz').on('click',function () {
        var tdrq_s = $('#txt_tdrq').val();
        if(tdrq_s ==""){
            //要设置未通电选啥该选项啊？肯定是要有通电方式才进来操作的呀！
            menuShowDialogTips("请选择通电日期");
            return;
        }
        var currdxtdfs = $('span.typeSelected').text();
        if(currdxtdfs ==""){
            menuShowDialogTips("请选择灯箱通电方式");
            return;
        }
        $.ajax({
            url: window.httplink+"/" +"edit_zptd",
            type:"POST",
            data:{"userid":userid,
                "csm":$("#option_csm").val(),
                "ztid":ztid,
                "ztpk":ztpk,
                "zpid":zpid,
                "zppk":zppk,
                "dxtdfs":currdxtdfs,
                "tdrq":tdrq_s
            },
            dataType:"html",
            success:function (data) {
                var result = eval('('+data+')');
                if(result.code=="0") {
                    var newpklist = result.data;
                    var newztpk = result.ztpk;
                    //进行站牌属性修改后的值回填
                    var newdata   ={"dxtdfs_fgs":currdxtdfs,"tdrq_fgs":$('#txt_tdrq').val()};
                    var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                    var ztkey_old = newjson[0];
                    var zpkeylist = newjson[1];
                    var newztkey = newjson[2];
                    var newzpkeylist = newjson[3];
                    var ztobj = jsondata[newztkey];
                    for(var i=0;i<zpkeylist.length;i++)
                    {
                        var trid = zpkeylist[i]+"_"+ ztkey_old;
                        var newzpkey = newzpkeylist[i];
                        var dxtdfs =currdxtdfs;var tdrq = tdrq_s;
                        $("#" + trid).find("td").eq(10).html(dxtdfs + "<br>" + tdrq);//通电类型

                        if ($("#" + trid).hasClass("greenColor")) $("#" + trid).removeClass("greenColor");
                        $("#" + trid).addClass("redColor");

                        //变更TRID 以及 ZPKEY ZPKEY
                        $("#" + trid).removeAttr("zpkey").attr("zpkey", newzpkey);
                        $("#" + trid).removeAttr("ztkey").attr("ztkey", newztkey);
                        $("#" + trid).attr("id", newzpkey + "_" + newztkey);

                    }
                    art.dialog({id: 'html_dialog'}).close();
                }
                else{
                    menuShowDialogTips(result.msg);
                }
            }
        })
    });
}
//站牌长停
function  zpctEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var zpbh = zpobj.zpbh;
    var ztpk = "";
    if(ztobj.zt_pk_fgs) {
        ztpk = ztobj.zt_pk_fgs;
    }else if(ztobj.zt_pk){
        ztpk = ztobj.zt_pk;
    }
    var ztid = "";
    if(ztobj.zt_id_fgs){
        ztid = ztobj.zt_id_fgs;
    }else if(ztobj.zt_id){
        ztid = ztobj.zt_id;
    }
    var zpid = "";
    if(zpobj.zp_id_fgs){
        zpid = zpobj.zp_id_fgs;
    }else if(zpobj.zp_id){
        zpid = zpobj.zp_id;
    }
    var zppk = "";
    if(zpobj.zp_pk_fgs){
        zppk = zpobj.zp_pk_fgs;
    }else if(zpobj.zp_pk){
        zppk = zpobj.zp_pk;
    }

    var html_content = "<div style='padding: 5px 5px 5px 5px;'><input type='text' id='txt_ctrq' placeholder='长停日期' class='Wdate' onclick='showRq()' value=''> </div>";
    html_content +="<div style='padding: 5px 5px 5px 5px;'><input type='text'     id='txt_yjxfsj' placeholder='预计修复时间' class='Wdate' onclick='showRq()' value=''> </div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_setct' value='确认'> </div>";
    menuShowDialogWithHtmlNoButton(zpbh+"站牌长停",html_content,230,280);


    $('#bt_setct').on('click',function () {
        var ctrq = $('#txt_ctrq').val();
        if(ctrq ==""){
            menuShowDialogTips("请选择长停日期");
            return;
        }
        var yjxfsj = $('#txt_yjxfsj').val();
        if(yjxfsj ==""){
            menuShowDialogTips("请选择预计修复时间");
            return;
        }
        $.ajax({
            url: window.httplink+"/" +"edit_zpct",
            type:"POST",
            data:{"userid":userid,
                "csm":$("#option_csm").val(),
                "zpid":zpid,
                "zppk":zppk,
                "ctrq":ctrq,
                "yjxfsj":yjxfsj
            },
            dataType:"html",
            success:function (data) {
                var result = eval('('+data+')');
                if(result.code=="0") {
                    var newpklist = result.data;
                    var newztpk = result.ztpk;
                    //进行站牌属性修改后的值回填
                    var newdata   ={"ctrq_fgs":ctrq,"yjxfsj_fgs":yjxfsj};
                    var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                    var ztkey_old = newjson[0];
                    var zpkeylist = newjson[1];
                    var newztkey = newjson[2];
                    var newzpkeylist = newjson[3];
                    var ztobj = jsondata[newztkey];
                    art.dialog({id: 'html_dialog'}).close();
                }
                else{
                    menuShowDialogTips(result.msg);
                }
            }
        })
    });
}

//设同站
/*function  zpstzEdit(src) {
    var ztzpjson =$(src).parent().parent().attr("json-val");
    var url = window.httplink+"/" +"stz";
    var ztbh = eval('('+ztzpjson+')').ztbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_ztzpjson", ztzpjson);
    menuShowdialogWithPars(url,"",ztbh+"设同站",800,300,"",null,null);
}*/

//设同站
function  zpstzEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var ztpk = "";
    if(ztobj.zt_pk_fgs){ ztpk = ztobj.zt_pk_fgs;}else if(ztobj.zt_pk){ztpk = ztobj.zt_pk;}
    var ztid = "";
    if(ztobj.zt_id_fgs){ztid = ztobj.zt_id_fgs;}else if(ztobj.zt_id){ztid = ztobj.zt_id;}

    var zm = '';
    if(ztobj.zm_fgs) zm = ztobj.zm_fgs; else zm = ztobj.zm ;
    var xzqy = '';
    if(ztobj.xzqy_fgs) xzqy = ztobj.xzqy_fgs; else xzqy = ztobj.xzqy;
    var lm = '';
    if(ztobj.lm_fgs) lm = ztobj.lm_fgs; else lm = ztobj.lm;
    var zdfw = '';
    if(ztobj.zdfw_fgs) zdfw = ztobj.zdfw_fgs; else zdfw = ztobj.zdfw;
    var fjbzw = '';
    if(ztobj.fjbzw_fgs) fjbzw = ztobj.fjbzw_fgs; else fjbzw = ztobj.fjbzw;

    var html_content ="<div style='text-align: left;margin-top:0'>" +
                        "<input id='input_number'  type='text' style='border:1px solid #222222;width: 100px;height: 30px;margin-right: 10px' value='' placeholder='请输入站亭编号'>" +
                        "<span  style='margin-right: 10px' id='zm' style='font-size: 14px'>"+ zm +"</span>" +
                        "<span  style='margin-right: 10px' id='xzqy'>"+ xzqy +"</span>" +
                        "<span  style='margin-right: 10px' id='lm'>"+ lm +"</span>" +
                        "<span  style='margin-right: 10px' id='zdfw'>"+ zdfw +"</span>" +
                        "<span  style='margin-right: 10px' id='fjbzw'>"+ fjbzw +"</span>" +
                     "</div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;margin-top: 10px'><input type='button' id='bt_settz' value='确认'> </div>";
    menuShowDialogWithHtmlNoButton(ztbh+"设同站",html_content,600,200);
    $('#bt_settz').on('click',function () {
        var ztbh_stz = $.trim( $('#input_number').val());
        if( ztbh_stz == ''){
            menuShowDialogTips("请输入站亭编号");
            return;
        }
        $.ajax({
            url: window.httplink+"/" +"edit_stz",
            type:"POST",
            data:{"userid":userid,
                "csm":$("#option_csm").val(),
                 "ztid":ztid,
                 "ztpk":ztpk,
                 "ztbh":ztbh_stz
            },
            dataType:"html",
            success:function (data) {
                var result = eval('('+data+')');
                if(result.code=="0") {
                    var newpklist = result.data;
                    var newztpk = result.ztpk;
                    //进行站牌属性修改后的值回填
                    var newdata   ={"ztbh_fgs":ztbh_stz};
                    var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                    var ztkey_old = newjson[0];
                    var zpkeylist = newjson[1];
                    var newztkey = newjson[2];
                    var newzpkeylist = newjson[3];
                    var ztobj = jsondata[newztkey];

                    //变更TRID 以及 ZPKEY ZPKEY
                    $("#" + trid).removeAttr("zpkey").attr("zpkey", newzpkey);
                    $("#" + trid).removeAttr("ztkey").attr("ztkey", newztkey);
                    $("#" + trid).attr("id", newzpkey + "_" + newztkey);
                    art.dialog({id: 'html_dialog'}).close();
                }
                else{
                    menuShowDialogTips(result.msg);
                }
            }
        })
    })
}
function  showRq() {
    WdatePicker({dateFmt:'yyyy-MM-dd'});
}

//拆除灯箱
function  zpccEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var zpbh  = zpobj.zpbh;
    var zp_detail = zpkey.split('_');
    var ztpk = "";
    if(ztobj.zt_pk_fgs){ ztpk = ztobj.zt_pk_fgs;}else if(ztobj.zt_pk){ztpk = ztobj.zt_pk;}
    var ztid = "";
    if(ztobj.zt_id_fgs){ztid = ztobj.zt_id_fgs;}else if(ztobj.zt_id){ztid = ztobj.zt_id;}
    var zppk = "";
    if(zpobj.zp_pk_fgs) {
        zppk = zpobj.zp_pk_fgs;
    }else if(zpobj.zp_pk) {
        zppk = zpobj.zp_pk;
    }
    else if(zp_detail[1] != '-1'){
        zppk = zp_detail[1];
    }
    var zpid = "";
    if(zpobj.zp_id_fgs){zpid = zpobj.zp_id_fgs}else if(zpobj.zp_id){zpid = zpobj.zp_id;}
    var scrq = "";
    if(zpobj.zpscrq_fgs!=null) scrq = zpobj.zpscrq_fgs;
    else if(zpobj.zpscrq!=null) scrq = zpobj.zpscrq;
    var sclx ="";
    if(zpobj.zpsclx_fgs!=null) sclx = zpobj.zpsclx_fgs;
    else if(zpobj.zpsclx!=null) sclx = zpobj.zpsclx;
    var html_content ="<div style='width:200px;margin: auto;margin-bottom: 10px'>" +
                        /*"<label style='margin-right: 20px;'><input type='radio' name='chdx_type' checked class='chdx_type'>临时拆除</label>" +*/
                        "<label><input type='radio' name='chdx_type' class='chdx_type' checked>永久拆除</label>" +
                      "</div>";
    html_content +="<div id='lscc_dx' style='width: 200px;height: 50px;margin:10px auto''>" +
                        "<input type='text' id='txt_lsscrq' style='margin-bottom: 10px' class='Wdate' placeholder='临时拆除日期' onclick='showRq()' value='"+scrq+"'> " +
                        "<input type='text' id='txt_yjxfrq' class='Wdate' placeholder='预计修复日期' onclick='showRq()' value='"+scrq+"'>" +
                    "</div>";
    html_content += "<div id='yjcc_dx' style='width: 200px;height: 50px;margin:10px auto''>" +
                        "<input type='text' id='txt_scrq' class='Wdate' placeholder='拆除日期' onclick='showRq()' value='"+scrq+"'>" +
                    "</div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_deldx' value='确认'> </div>";
    menuShowDialogWithHtmlNoButton(zpbh+"灯箱拆除",html_content,300,100);
    $('#lscc_dx').hide();

    $('#bt_deldx').on('click',function () {
        var scrq = $('#txt_scrq').val();
        if(scrq==""){
            menuShowDialogTips("请选择拆除日期");
            return;
        }
        var sclx ="拆除";
        $.ajax({
            url: window.httplink+"/" +"edit_ccdx",
            type:"POST",
            data:{"userid":userid,
                "csm":$("#option_csm").val(),
                "ztid":ztid,
                "ztpk":ztpk,
                "zpid":zpid,
                "zppk":zppk,
                "scrq":scrq,
                "sclx":sclx
            },
            dataType:"html",
            success:function (data) {
                var result = eval('('+data+')');
                if(result.code=="0") {
                    var newpklist = result.data;
                    //进行删除灯箱值回填
                    var newdata   ={"zpscrq_fgs":scrq};
                    var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                    var ztkey_old = newjson[0];
                    var zpkeylist = newjson[1];
                    var newztkey = newjson[2];
                    var newzpkeylist = newjson[3];
                    zpdxEditTrHtml(ztkey_old,zpkeylist,newztkey,newzpkeylist);
                    art.dialog({id: 'html_dialog'}).close();
                }
                else{
                    menuShowDialogTips(result.msg);
                }
            }
        })
    })
   /* $('.chdx_type').change(function () {
        if ( $(this).parent().text() == '临时拆除' ){
            $('#lscc_dx').show();
            $('#yjcc_dx').hide();
            $('#txt_scrq').val('');
        }
        else if( $(this).parent().text() == '永久拆除' ) {
            $('#lscc_dx').hide();
            $('#txt_lsscrq').val('');
            $('#txt_yjxfrq').val('');
            $('#yjcc_dx').show();
        }
    })*/
    /*$('#bt_deldx').on('click',function () {
        //临时拆除方式;只有当改div block出来才取日期值
        if( $('#lscc_dx').css("display")=="block"){
            var lsscrq = $('#txt_lsscrq').val();
            var yjxfrq = $('#txt_yjxfrq').val();

            if( lsscrq == ""){
                menuShowDialogTips("请选择临时拆除日期");
                return;
            }
            if( yjxfrq == ""){
                menuShowDialogTips("请选择预计修复日期");
                return;
            }
            $.ajax({
                url: window.httplink+"/" +"edit_lscc",
                type:"POST",
                data:{"userid":userid,
                    "csm":$("#option_csm").val(),
                    "ztid":ztid,
                    "ztpk":ztpk,
                    "zpid":zpid,
                    "zppk":zppk,
                    "lsccrq":lsscrq,
                    "yjxfrq":yjxfrq
                },
                dataType:"html",
                success:function (data) {
                    var result = eval('('+data+')');
                    if(result.code=="0") {
                        var newpklist = result.data;
                        var newztpk = result.ztpk;
                        //进行站牌属性修改后的值回填
                        var newdata   ={"lsscrq_fgs":lsscrq,"yjxfrq_fgs":yjxfrq};
                        var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                        var ztkey_old = newjson[0];
                        var zpkeylist = newjson[1];
                        var newztkey = newjson[2];
                        var newzpkeylist = newjson[3];
                        var ztobj = jsondata[newztkey];
                        zpdxEditTrHtml(ztkey_old,zpkeylist,newztkey,newzpkeylist);
                        art.dialog({id: 'html_dialog'}).close();
                    }
                    else{
                        menuShowDialogTips(result.msg);
                    }
                }
            })
        }
        //永久拆除;只有当改div block出来才取日期值
        if( $('#yjcc_dx').css("display")=="block" ){
            var scrq = $('#txt_scrq').val();
            if(scrq==""){
                menuShowDialogTips("请选择拆除日期");
                return;
            }
            var sclx ="拆除";
            $.ajax({
                url: window.httplink+"/" +"edit_ccdx",
                type:"POST",
                data:{"userid":userid,
                    "csm":$("#option_csm").val(),
                    "ztid":ztid,
                    "ztpk":ztpk,
                    "zpid":zpid,
                    "zppk":zppk,
                    "scrq":scrq,
                    "sclx":sclx
                },
                dataType:"html",
                success:function (data) {
                    var result = eval('('+data+')');
                    if(result.code=="0") {
                        var newpklist = result.data;
                        var newztpk = result.ztpk;
                        //进行站牌属性修改后的值回填
                        var newdata   ={"scrq_fgs":scrq};
                        var newjson = modifZpJsonData(ztkey,zpkey,newdata,newpklist);
                        var ztkey_old = newjson[0];
                        var zpkeylist = newjson[1];
                        var newztkey = newjson[2];
                        var newzpkeylist = newjson[3];
                        var ztobj = jsondata[newztkey];
                        zpdxEditTrHtml(ztkey_old,zpkeylist,newztkey,newzpkeylist);
                        art.dialog({id: 'html_dialog'}).close();
                    }
                    else{
                        menuShowDialogTips(result.msg);
                    }
                }
            })
        }
    });*/
}
//拆除灯箱的行HTML变更
function zpdxEditTrHtml(ztkey,zpkeylist,newztkey,newzpkeylist)
{
    for(var i=0;i<zpkeylist.length;i++)
    {
        var trid = zpkeylist[i]+"_"+ ztkey;
        var newzpkey = newzpkeylist[i];
        var ztobj = jsondata[newztkey];
        var zpobj = ztobj.zps[newzpkey];

        var scrq ="";
        if(zpobj.zpscrq_fgs && zpobj.zpscrq_fgs!="")     scrq = zpobj.zpscrq_fgs;
        $("#" + trid).find("td").eq(15).html(scrq);//灯箱拆除日期

        if ($("#" + trid).hasClass("greenColor")) $("#" + trid).removeClass("greenColor");
        $("#" + trid).addClass("redColor");

        //变更TRID 以及 ZPKEY ZPKEY
        $("#" + trid).removeAttr("zpkey").attr("zpkey", newzpkey);
        $("#" + trid).removeAttr("ztkey").attr("ztkey", newztkey);
        $("#" + trid).attr("id", newzpkey + "_" + newztkey);

    }
}
//拆除站点
/*function  ztccEdit(src) {
    var ztzpjson =$(src).parent().parent().attr("json-val");
    var csm = $("#option_csm").val();
    //直接进行数据操作。不需要界面
    var ztbh = eval('('+ztzpjson+')').ztbh;
    menuShowDialogConfirm("拆除站点","确认拆除站点："+ztbh+"?",ztccCallbak,[eval('('+ztzpjson+')')]);
}*/
//拆除站点
function ztccEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh  = ztobj.ztbh;
    var ztpk = "";
    if(ztobj.zt_pk_fgs){ ztpk = ztobj.zt_pk_fgs;}else if(ztobj.zt_pk){ztpk = ztobj.zt_pk;}
    var ztid = "";
    if(ztobj.zt_id_fgs){ztid = ztobj.zt_id_fgs;}else if(ztobj.zt_id){ztid = ztobj.zt_id;}
    var scrq = "";
    if(ztobj.ztscrq_fgs!=null) scrq = ztobj.ztscrq_fgs;
    else if(ztobj.ztscrq!=null) scrq = ztobj.ztscrq;
    var sclx ="";
    if(ztobj.ztsclx_fgs!=null) sclx = ztobj.ztsclx_fgs;
    else if(ztobj.ztsclx!=null) sclx = ztobj.ztsclx;
    var html_content = "<div id='yjcc_dx' style='width: 200px;height: 50px;margin:10px auto''>" +
                        "<input type='text' id='txt_scrq' class='Wdate' placeholder='拆除日期' onclick='showRq()' value='"+scrq+"'>" +
                       "</div>";
    html_content +="<div style='text-align:left;padding: 5px 5px 5px 5px;'>拆除是由：<textarea id='txt_ccsy' style='width:100%;height:80px' >"+sclx+"</textarea></div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_delzd' value='确认'> </div>";
    menuShowDialogWithHtmlNoButton(ztbh+"拆除站点",html_content,300,100);
    $('#bt_delzd').on('click',function () {
        var scrq = $('#txt_scrq').val();
        if( scrq == ''){
            menuShowDialogTips("请选择拆除日期");
            return;
        }
        var ccsy = $.trim( $('#txt_ccsy').val() );
        if( ccsy == '' ){
            menuShowDialogTips("请填写拆除事由");
            return;
        }
        $.ajax({
            url: window.httplink+"/" +"edit_cczd",
            type:"POST",
            data:{"userid":userid,
                "csm":$("#option_csm").val(),
                "ztid":ztid,
                "ztpk":ztpk,
                "scrq":scrq,
                "sclx":ccsy
            },
            dataType:"html",
            success:function (data) {
                var result = eval('('+data+')');
                if(result.code=="0") {
                    var newpklist = result.data;
                    //站点删除不能回填
                    var newdata   ={"ztscrq_fgs":scrq,"ztsclx_fgs":ccsy};
                    art.dialog({id: 'html_dialog'}).close();
                    menuShowDialogTips(result.msg);
                }
                else{
                    menuShowDialogTips(result.msg);
                }
            }
        })
    });
}
//临时拆除
function  lsccEdit(src) {
    var ztzpjson =$(src).parent().parent().attr("json-val");
    var url = window.httplink+"/" +"lscc";
    var ztbh = eval('('+ztzpjson+')').ztbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztzpjson", eval('('+ztzpjson+')'));
    menuShowdialogWithPars(url,"",ztbh+"临时拆除",250,250,"",lsccEditCallbak,[eval('('+ztzpjson+')')]);
}
//临时拆除回调事件
function  lsccEditCallbak(pars) {
    var zpjson = pars[0];
    var zpbh = zpjson.zpbh;
    var modifyState = art.dialog.data("return_modifyState");
    if(modifyState ==true) {
        //进行站亭地址修改后的值回填

    }
}

//站点审核	资料管理
function  ztAudit(src) {
    //ie9以下不支持event.stopPropagation();//阻止行点击事件的触发
    if (event.stopPropagation) {
        // 针对 Mozilla 和 Opera
        event.stopPropagation();
    }
    else if (window.event) {
        // 针对 IE
        window.event.cancelBubble = true;
    }
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey]
    var zpobj  = ztobj.zps[zpkey];
    var url = "pageRedirect.aspx" ;
    var ztbh =ztobj.ztbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_userid",userid);
    artDialog.data("post_ztobj", ztobj);
    artDialog.data("post_zpobj","zpobj");
    artDialog.data("post_hasqyfzmc", hasqyfzmc);
    artDialog.data("post_isAuidt",true);
    menuShowdialogWithPars(url,"",ztbh+"站点审核",960,520,"&config=ztdetail",ztAuditCallbak,[ztkey]);


}

function ztAuditCallbak(pars) {
    var ztkey = pars[0];
    var modifyState = art.dialog.data("return_modifyState");
    if(modifyState ==true) {
        //进行站亭地址修改后的值回填
        var tgzt   = art.dialog.data("return_tgzt");
        var zpkeys  = jsondata[ztkey].zpkeys;
        jsondata[ztkey].xgzt = tgzt;
        for(var i=0;i<zpkeys.length;i++) {
            var zpkey = zpkeys[i];
            var trid = zpkey +"_"+ztkey;
            $("#" + trid).removeClass("redColor");
            if (tgzt == "不通过")
                $("#" + trid).addClass("greenColor");
        }
    }
}
//地址标签	资料管理
function  zpdzLMark(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var zpbh = zpobj.zpbh;
    var zpid = zpobj.zp_id;
    var dzmc = "";
    if(zpobj.dzmc) dzmc = zpobj.dzmc;
    var html_content ="<div style='padding: 5px 5px 5px 5px;'><input type='text' id='txt_dzmc' value='"+dzmc+"'> </div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_setdz' value='设定标签'> </div>";
    menuShowDialogWithHtmlNoButton(zpbh+"添加地址标签",html_content,300,100);
    $('#bt_setdz').on('click',function () {
        var dzmc = $('#txt_dzmc').val();
        if(dzmc==""){
            menuShowDialogTips("地址名称将会被清空");
        }
        $.ajax({
            url: window.httplink+"/" +"edit_dzbq",
            type:"POST",
            data:{"userid":userid,"zpid":zpid,"dzmc":dzmc,"ztkey":ztkey,"zpkey":zpkey},
            dataType:"html",
            success:function (data) {
                var trid = zpkey+"_"+ztkey;
                $("#" + trid).find("td").eq(15).html(dzmc);
                jsondata[ztkey].zps[zpkey].dzmc = dzmc;
                art.dialog({ id: 'html_dialog' }).close();
            }
        })
    });
}
//分类标签	资料管理
function  zpflLMark(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var zpbh = zpobj.zpbh;
    var zpid = zpobj.zp_id;
    var flmc = "";
    if(zpobj.flmc)flmc =zpobj.flmc;
    var html_content ="<div style='padding: 5px 5px 5px 5px;'><input type='text' id='txt_flmc' value='"+flmc+"'> </div>";
    html_content +="<div style='text-align:center;padding: 5px 5px 5px 5px;'><input type='button' id='bt_setdz' value='设定标签'> </div>";
    menuShowDialogWithHtmlNoButton(zpbh+"添加分类标签",html_content,300,100);
    $('#bt_setdz').on('click',function () {
        var flmc = $('#txt_flmc').val();
        if(flmc==""){
            menuShowDialogTips("分类标签名称会被清空");
        }
        $.ajax({
            url: window.httplink+"/" +"edit_flbq",
            type:"POST",
            data:{"userid":userid,"zpid":zpid,"flmc":flmc,"ztkey":ztkey,"zpkey":zpkey},
            dataType:"html",
            success:function (data) {
                var trid = zpkey+"_"+ztkey;
                $("#" + trid).find("td").eq(16).html(flmc);//改页面
                jsondata[ztkey].zps[zpkey].flmc = flmc;//改缓存
                art.dialog({ id: 'html_dialog' }).close();

            }
        });
    });
}
//销售调级	资料管理
function  zpxstjEdit(src) {
    var ztkey =$(src).parent().parent().attr("ztkey");
    var zpkey =$(src).parent().parent().attr("zpkey");
    var ztobj  = jsondata[ztkey];
    var zpobj  = ztobj.zps[zpkey];
    var ztbh = ztobj.ztbh;
    var zpid = zpobj.zp_id;
    var csm = $("#option_csm").val();

    var html_content ="<div id='row'></div>";
    html_content +="<div style='width:50px;text-align:center;'> " +
        "<span style='display:block;text-align:center;border:1px solid #222222;border-radius:4px;width:100px;height:24px;line-height:24px;font-size:14px;cursor:pointer;margin-right:20px;' id='save'>确定</span> " +
        "</div>";
    menuShowDialogWithHtmlNoButton(ztbh+"销售调级",html_content,200,320);

    //站亭级别的json
    var ztjbjson =  getJsonWithUrl(window.httplink+"/" +"option_ztjb","");
    var xs_data = ztjbjson.data;
    var len = xs_data.length;
    var optionhtml = '';
    for(var i=0;i<len;i++) {
        optionhtml += '<span class="btn_s" style="display:block;width:100px;height:24px;text-align:center;background:#dddddd;margin-bottom:10px;cursor:pointer;">'+ xs_data[i].jbdm +'</span>';
    }
    $('#row').append(optionhtml);

    //给销售级别加上背景色
    $('span').each(function () {
        if( $(this).text() == ztobj.ztjb ){
            $(this).addClass("typeSelected");
            $(this).css({'background-color':'#3199f3'});
        }
    })

    $('.btn_s').on('click',function () {
        $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
        $(this).css({'background-color':'#3199f3'}).siblings().css({'background-color':'#dddddd'});
    })

    $('#save').on('click',function () {
        var ztjb_s = $('span.typeSelected').text();
        if( ztjb_s == ztobj.ztjb){
            menuShowDialogTips('没有做修改');
        }else {
            $.ajax({
                url: window.httplink+"/" +"edit_xstj",
                type:"POST",
                data:{
                    "userid" : userid,
                    "ztid"   : ztobj.zt_id,
                    "csm"    : $("#option_csm").val(),
                    "ztjbnew"  : ztjb_s,
                    "ztkey":ztkey
                },
                dataType:"json",
                success:function (data) {
                    if(data.code=="0") {
                        var zpkeys = jsondata[ztkey].zpkeys;
                        //循环所有的KEY进行重新赋值
                        for(var i=0;i<zpkeys.length;i++) {
                            var trid = zpkeys[i]+"_"+ztkey;
                            $("#" + trid).find("td").eq(3).html(ztjb_s);//改页面,
                        }
                        jsondata[ztkey].ztjb = ztjb_s;//改缓存
                        art.dialog({ id: 'html_dialog' }).close();
                    }else {
                        menuShowDialogTips(result.msg);
                    }
                }
            })
        }
    });
}
//销售调级	资料管理
/*function zpxstjEdit(src) {
    var ztzpjson =$(src).parent().parent().attr("json-val");
    var url ="xstj";
    var ztbh = eval('('+ztzpjson+')').ztbh;
    var csm = $("#option_csm").val();
    artDialog.data("post_csm", csm);
    artDialog.data("post_ztzpjson", ztzpjson);
    menuShowdialogWithPars(url,"",ztbh+"销售调级",200,320,"",null,null);
}*/

var newqueryRnd ="";//使用查询随机数界定查询，当
function queryList() {
    if($("#option_csm").val()=="请选择"){
        $("#option_csm").addClass("errorborder");
        $("#option_csm").shake(2, 10, 500);
        return;
    }
    $("#option_csm").removeClass("errorborder");
    $("#dxlbTable").find("tbody").empty();
    menuShowDialogLoading("数据查询中...");

    $.ajax({
        url:  window.httplink+"/" +"dxlb",
        type: "POST",
        dataType: "jsonp",
        data:queryPars(),
        success: function (result) {
            newqueryRnd =Math.random();
            jsondata ={};//清除页面数据
            dataid = "";//
            var data =result;
            if(data) {
                var title = data.title;
                dataid = data.dataid;//缓存的数据ID，需要在继续加载的时候传回去
                if(title)//统计信息
                    $("#tjxxspan").text(data.title);
                $("#tipdiv").show();
                //window.data(data);//进行前端缓存
                buildList(data,newqueryRnd,data.count,buildFirstComplet);
                stop =true;
            }
            else{
                $("#tipdiv").hide();
                menuLoadingDialogClose();
                //$("#contentDiv").empty().html("没有任何数据！");
            }
        },
        error:function (result) {
        }
    });
}

function downloadList() {
    if($("#option_csm").val()=="请选择"){
        $("#option_csm").addClass("errorborder");
        $("#option_csm").shake(2, 10, 500);
        return;
    }
    $("#option_csm").removeClass("errorborder");
    menuShowDialogLoading("数据下载中...");
    $.ajax({
        url:  window.httplink+"/" +"download",
        type: "POST",
        data:queryPars(),
        success: function (result) {
            menuLoadingDialogClose();
            window.open(eval('('+result+')').link);
        },
        error:function (result) {
            menuLoadingDialogClose();
        }
    });
}
//查询参数
function queryPars(){
    var zpbh ="";var zm =""; var fjbzw ="";var xzqy ="";var lm =""; var zdfw =""; var ztjb ="";var ggh="";var ksmc ="";var dxjzfs ="";var dxly ="";var dxtdfs ="";var qyfz="";
    //对页面参数进行分组
    //输入框参数
    var inputvalue = $("#input_all").val();
    if(inputvalue=="请输入查询关键字 用空格分隔进行模糊查询") inputvalue ="";
    if($("#input_all").val().indexOf("|")>=0)
    {
        inputvalue =$("#input_all").val().substring(0,$("#input_all").val().indexOf("|"));
    }

    // 行政区域
    if($("#option_xzqy").val()!="全部行政区域")
    {
        xzqy = "''" + $("#option_xzqy").val().split(";").join("'',''") +"''";
    }
    // 路名
    if($("#option_lm").val()!="全部路名")
    {//路名需要做特殊处理，将路名前面的区域剔除掉
        var lmArr = $("#option_lm").val().split(";");
        for(var i=0;i<lmArr.length;i++){
            var lmstr = lmArr[i];
            if(lmstr.indexOf("-")>=0)
                lmArr[i] = lmstr.substring(lmstr.indexOf("-"));
        }
        lm = "''" + lmArr.join("'',''") +"''";
    }
    // 站点方位
    if($("#option_zdfw").val()!="全部站点方位")
    {
        var zdfwstr=  $("#option_zdfw").val().substring(0,$("#option_zdfw").val().length-1);
        zdfw = "''" + zdfwstr.split(";").join("'',''") +"''";
    } // 建造类型
    if($("#option_jzlx").val()!="全部建造类型")
    {
        var jzlxstr=  $("#option_jzlx").val().substring(0,$("#option_jzlx").val().length-1);
        dxjzfs = "''" + jzlxstr.split(";").join("'',''") +"''";
    }
    // 灯箱来源
    if($("#option_dxly").val()!="全部灯箱来源")
    {
        var dxlystr=  $("#option_dxly").val().substring(0,$("#option_dxly").val().length-1);
        dxly = "''" + dxlystr.split(";").join("'',''") +"''";
    }
    // 灯箱规格
    if($("#option_ggh").val()!="全部灯箱规格")
    {
        var gghstr=  $("#option_ggh").val().substring(0,$("#option_ggh").val().length-1);
        ggh = "''" + gghstr.split(";").join("'',''") +"''";
    }
    // 灯箱款式
    if($("#option_dxks").val()!="全部灯箱款式")
    {
        var dxksstr=  $("#option_dxks").val().substring(0,$("#option_dxks").val().length-1);
        ksmc = "''" + dxksstr.split(";").join("'',''") +"''";
    }
    //销售等级
    if($("#option_xsdj").val()!="全部销售等级")
    {
        var ztjbstr=  $("#option_xsdj").val().substring(0,$("#option_xsdj").val().length-1);
        ztjb = "''" + ztjbstr.split(";").join("'',''") +"''";
    }


    //供电方式
    if($("#option_gdfs").val()!="全部供电方式")
    {
        var tdfsstr=  $("#option_gdfs").val().substring(0,$("#option_gdfs").val().length-1);
        dxtdfs = "''" + tdfsstr.split(";").join("'',''") +"''";
    }
    // 站牌状态
    var dtbz = ""; //已标注地图,未标注地图
    var xgzt = ""; //新建未审核','无修改','已修改待审核','修改审核通过','修改退回
    var xlzp = ""; //新站牌','老站牌
    var yszt = ""; //未验收','已验收'
    var cksc = ""; //已拆除
    var othervalue = "";
    if($("#option_zpzt").val()!="全部灯箱状态")
    {
        if($("#option_zpzt").val().indexOf("已标注地图")>=0 && $("#option_zpzt").val().indexOf("未标注地图")>=0){
            dtbz = "''已标注地图'',''未标注地图''";
        }else if($("#option_zpzt").val().indexOf("已标注地图")>=0 && $("#option_zpzt").val().indexOf("未标注地图") < 0){
            dtbz ="''已标注地图''";
        }else if($("#option_zpzt").val().indexOf("未标注地图")>=0 && $("#option_zpzt").val().indexOf("已标注地图") < 0 ){
            dtbz ="''未标注地图''";
        }

        if($("#option_zpzt").val().indexOf("新站牌")>=0 && $("#option_zpzt").val().indexOf("老站牌")>=0){
            xlzp = "''新站牌'',''老站牌''";
        }else if($("#option_zpzt").val().indexOf("新站牌")>=0 && $("#option_zpzt").val().indexOf("老站牌") < 0){
            xlzp = "''新站牌''";
        }else if($("#option_zpzt").val().indexOf("老站牌")>=0 && $("#option_zpzt").val().indexOf("新站牌") < 0 ){
            xlzp = "''老站牌''";
        }

        if($("#option_zpzt").val().indexOf("未验收")>=0 && $("#option_zpzt").val().indexOf("已验收")>=0){
            yszt = "''未验收'',''已验收''";
        }else if($("#option_zpzt").val().indexOf("未验收")>=0 && $("#option_zpzt").val().indexOf("已验收") < 0){
            yszt = "''未验收''";
        }else if($("#option_zpzt").val().indexOf("已验收")>=0 && $("#option_zpzt").val().indexOf("未验收") < 0 ){
            yszt = "''已验收''";
        }

        if($("#option_zpzt").val().indexOf("已拆除")>=0){
            cksc = "''Y''";
        }else {
            cksc = "''N''";
        }

        othervalue = $("#option_zpzt").val().replace("已标注地图;","").replace("未标注地图;","").replace("新站牌;","").replace("老站牌;","").replace("未验收;","").replace("已验收;","").replace("已拆除;","");
        //(othervalue);
        if(othervalue.indexOf(";")>=0)
        {
            xgzt  =  "''" + othervalue.split(";").join("'',''") +"''";
        }
    }
    // 区域分组
    if($("#option_qyfz").val()!="全部区域分组")
    {
        qyfz = "''" + $("#option_qyfz").val().split(";").join("'',''") +"''";
    }
    var pars={
        "csm":  $("#option_csm").val(),
        "userid":userid,"cxstr":inputvalue,"zpbh":zpbh,"zm":zm,"fjbzw":fjbzw,"xzqy":xzqy,"lm":lm,"zdfw":zdfw,
        "ztjb":ztjb,"ggh":ggh,"ksmc":ksmc,"dxjzfs":dxjzfs,"dxly":dxly,"dxtdfs":dxtdfs,"qyfzmc":qyfz,"dtbz":dtbz,"xlzp":xlzp,"yszt":yszt,"cksc":cksc,"xgzt":xgzt
    }
   return pars;
}
//绑定列表数据
var jsondata ={};
var dataid ="";
function buildList(data,rnd,count,callback)
{
    //$("#contentDiv").empty();
    //$("#contentDiv").append(data);
    var ztlist = data.ztkeys;
    jsondata.count = count;
    var trAltClass ="";//站亭颜色交替样式
    for(var i=0;i<ztlist.length;i++)
    {
        var keyname = ztlist[i];
        var ztObj = data.data[keyname];//站亭对象
        var ztobjbefore = null;
        if(i!=0)ztobjbefore = data.data[ztlist[i-1]];//站亭颜色交替
        jsondata[keyname]=ztObj;
        // ztkeylist.push(keyname)
        // jsondata["ztkeylist"]=ztkeylist;
        var zplist = ztObj.zpkeys;
        var zpobjs = ztObj.zps;
        if(ztobjbefore) {//站亭编号不一致时，需要变色
            if (ztObj.ztbh != ztobjbefore.ztbh) {
                if(trAltClass=="AltRow") trAltClass="";
                else trAltClass ="AltRow"
            }
        }
        else{//第一次加载和后续的动态加载需要先判断TABLE的上一行的颜色。
            if($("#dxlbTable tbody tr:last").length>0) {
                var trbeforeclass = $("#dxlbTable tbody tr:last").attr("class");
                if (trbeforeclass.indexOf("AltRow") >= 0) trAltClass = "";
                else trAltClass = "AltRow"
            }
            else//第一行为白色即可
                trAltClass ="";
        }
        for(var z=0;z<zplist.length;z++) {
            var zpobj = zpobjs[zplist[z]];
            var zpkeyname = zplist[z];
            // zpkeylist.push(zpkeyname)
            // jsondata["zpkeylist"]=zpkeylist;
            var tr = buildHtml([ztObj,zpobj],[zpkeyname,keyname],trAltClass);
            $("#dxlbTable").find("tbody").append(tr);
        }

    }
    (callback && typeof(callback) === "function") && callback(rnd,count);
}

function  buildHtml(obj,keyname,trAltClass) {
    var ztobj = obj[0];
    var zpobj = obj[1];
    var trFontClass = "";
    if(ztobj.xgzt=="待审"){
        trFontClass =" redColor";
    }
    if(ztobj.xgzt=="不通过"){
        trFontClass =" greenColor";
    }
    if((zpobj.ztscrq_fgs!=null && zpobj.ztscrq_fgs!="")||(zpobj.zpscrq!=null && zpobj.zpscrq!="")){
        trFontClass =" oragenColor";
    }
    if(zpobj.zpbh==null || zpobj.zpbh=="")
    {//没有站牌编号的行，是站亭的待拆数据。。。
        trFontClass =" oragenColor";
    }
    var tr = $('<tr valign="top" id="'+keyname[0]+"_"+keyname[1]+'" zpkey="'+keyname[0]+'" ztkey="'+keyname[1]+'"  class="'+trAltClass+trFontClass+'" onclick="trcomboclick(this)"></tr>');//只将主键存储，其他的全部取存储数据中读取
    //列1：序号
    tr.append("<td xh='"+zpobj.xh+"' class='col00'>" +
        zpobj.xh +"."+
        "</td>");
    //列2：站点
    tr.append("<td xh='"+zpobj.xh+"' class='col0'><a href='javascript:void(0)'  onclick='showztDetail(this)'>"+
        ztobj.ztbh +"<br/>" +
        ztobj.zm +"</a></td>");
    //列3：站点地址
    var qyfzmc = "";
    if(zpobj.qyfzmc!=null && zpobj.qyfzmc!='')
        qyfzmc =zpobj.qyfzmc;
    else qyfzmc = "未分组";
    tr.append("<td class='col1'>"+ztobj.xzqy+"<span style='qyfzmcspan'>("+qyfzmc+")</span><br/>"+
              ztobj.lm+"("+ztobj.zdfw+")"+
              "</td>");
    //列4：附近标志物
    tr.append("<td class='col2'>"+ ztobj.fjbzw+"</td>");
    //列5：销售等级
    tr.append("<td class='col3'>"+ ztobj.ztjb+"</td>");
    //列6：位置序号
    tr.append("<td class='col4'>"+zpobj.wzph+"<br/>"+zpobj.dxcx+"</td>");
    //列7：灯箱编号
    tr.append("<td class='col5'>"+zpobj.zpbh+"<br/>"+zpobj.ggh+"</td>");
    //列8：灯箱来源 自建时，不显示来源和权属，来源为空时显示无来源
    var dxjzfsstr = "";
    if(zpobj.dxjzfs == "自建")
        dxjzfsstr = zpobj.dxjzfs;
    else
    {
        var dxly = zpobj.dxly?zpobj.dxly:"无来源";
        var dxqs = zpobj.dxqs?zpobj.dxqs:"";
        if(dxqs!="") dxqs = "/"+dxqs;//避免出现灯箱权属为空时候只显示/
        dxjzfsstr = zpobj.dxjzfs+"<br/>"+ dxly +dxqs;
    }
    tr.append("<td class='col6' >"+dxjzfsstr+"</td>");//灯箱来源
    //列9：常规属性
    var ksmc = zpobj.ksmc?zpobj.ksmc:"未定义款式";
    tr.append("<td class='col7'>"+ksmc+"<br/>"+zpobj.dxlx+"</td>");
    //列10：特殊属性
    var zpzt = zpobj.zpzt=="滚动"?zpobj.zpzt:"";
    var dmdx  = zpobj.dmdx?zpobj.dmdx :"";
    tr.append("<td class='col8'>"+dmdx+"<br/>"+zpzt+"</td>");
    //列11：通电
    var dxtdfsstr=zpobj.dxtdfs?zpobj.dxtdfs:"未设置通电方式";
    if(zpobj.tdrq=="") dxtdfsstr ="";
    tr.append("<td class='col9'>"+dxtdfsstr+"<br/>"+zpobj.tdrq+"</td>");
    //列12：建造日期
    tr.append("<td class='col10'>"+zpobj.jtrq+"<br/>"+zpobj.ksxsrq+"</td>");
    //列13：验收信息
    var zmysstr = zpobj.dxzmdzbq?"<a href='javascript:void(0)' onclick='showYsInfo(this)'>已验收</a>":"<a href='javascript:void(0)' class='newlink' onclick='showYsInfo(this)'>未验收</a>";
    var bmysstr = zpobj.dxbmdzbq?"<a href='javascript:void(0)' onclick='showYsInfo(this)'>已验收</a>":"<a href='javascript:void(0)' class='newlink' onclick='showYsInfo(this)'>未验收</a>";
    tr.append("<td class='col11'>正:"+zmysstr+"<br/>背:"+bmysstr+"</td>");//验收信息
    //列14：位置标识
    var dtbzstr= "";
    if(ztobj.dtbz =="已标注地图" )
        dtbzstr = "<a  href='javascript:void(0)' onclick='showBzInfo(this)' >地图:已标注</a><br/>"+ztobj.imark;
    else
        //dtbzstr = "<a  href='javascript:void(0)'  class='newlink' onclick='showBzInfo(this)' >地图:未标注</a><br/>"+ztobj.imark;
        dtbzstr = "<span>地图:未标注</span>";
    tr.append("<td class='col12'>"+dtbzstr+"</td>");
    //列15：销售状态
    tr.append("<td class='col13'>"+zpobj.ksxsrq+"<br/>"+zpobj.dxxszt+"</td>");
    //列16：拆除日期
    if(zpobj.wzph == '' && zpobj.wzph_fgs == ''){
        //空位置编号
        tr.append("<td class='col14'>"+ ztobj.ztscrq_fgs +"<br/>"+ ztobj.ztsclx_fgs+"</td>");
    }else{
        var zpscrq = '';var zpsclx = '';
        if(zpobj.zpscrq_fgs){
            zpscrq = zpobj.zpscrq_fgs;
        } else if(zpobj.zpscrq){
            zpscrq = zpobj.zpscrq;
        }
        if(zpobj.zpsclx_fgs){
            zpsclx = zpobj.zpsclx_fgs;
        } else if(zpobj.zpsclx){
            zpsclx = zpobj.zpsclx;
        }
        tr.append("<td class='col14'>"+ zpscrq +"<br/>"+ zpsclx +"</td>");
    }
    //列17：地址标签
    tr.append("<td class='col15'>"+zpobj.dzmc+"</td>");
    //列18：分类标签
    tr.append("<td class='col16'>"+zpobj.flmc+"</td>");
    return tr;
}

function buildFirstComplet(rnd,count) {
    if($("#bt_advanced").hasClass("AdvancedClick"))
    {
        $("#bt_advanced").click();
    }
    menuLoadingDialogClose();
    if(hasqyfzmc)//没有区域分组的直接隐藏
        $(".qyfzmcspan").show();
    else
        $(".qyfzmcspan").hide();

    if($("#dxlbTable").find("tbody tr").length ==0)
    {//该城市没有任何站点。
        if(userCsEditPriv) {
            if($("#bt_addnew").length==0) {
                $("#contentDiv").append("<input type='button' value='新增站点'  id='bt_addnew'>");
                $("#bt_addnew").on("click", function () {
                    zdAdd();
                });
            }
        }
    }
    else{
        $("#bt_addnew").remove();
        //因为加载时，因为APPEND会导致其他按钮事件无法响应，暂时先改回滚动到底继续加载
        // if(rnd!=newqueryRnd) return;//当传入的随机数和新查询的数据数不一致时，不再进行递归查询
        // loadMore(count);

    }
}
// function  loadMore(count) {
//      $.ajax({
//          url:  window.httplink+"/" +"dxlb_more",
//          data:{
//              "userid":userid,
//              "dataid":dataid,
//              "start":count
//          },
//          type: "POST",
//          dataType: "json",
//          success: function (data) {
//              if(data) {
//                 if(data.ztkeys.length!=0) {
//                     // var catchdata = Window.data();
//                     // catchdata.
//                     buildList(data,rnd,data.count, null);
//                 }
//              }
//              else{
//
//              }
//          }
//     });
// }
//
//
//
//
// //修改HTML，需要先调用修改HTML，再修改JSONDATA，避免数据
// function modifHtml(oldkey,newobj,newpklist) {
//     //需要先对newpklist 进行解析成 ztkey zpkey
//     var ztkey = oldkey[1];
//     var currzpkey = oldky[0];//为啥要传这个ZPKEY呢，因为可能涉及到新增灯箱，需要在指定行下面APPEND一行，其他的循环ZTOBJ里面的即可
//     var ztkeyArr = ztkey.split('_');
//     var ztid = ztkeyArr[0];
//     var ztpk = ztkeyArr[1];
//     var newztpk = newpklist.ztpk;
//     var newztkey = ztid+"_"+newztpk;
//     if(newztpk == newztkey )
//     {  //站亭KEY一致，该站亭之前做过修改，
//        //那么只要对比newobj 和 之前的obj有啥不同即可
//        var ztobj = jsondata[ztkey];
//        //for()
//     }
//     else
//     {
//         //站亭KEY不一致，代表可能两种情况
//         //新建审核通过后,ZTID发生变化
//         //其他已有ZTID进行修改时，ZTPK产生数据
//     }
//     // var trid = oldkey[0]+"_"+oldkey;
//     // var trobj =  $("#"+trid);
//     // var newtr = buildHtml(newobj,oldclass,newkey);
//     // trobj.html(newtr.html());
// }


//修改jsondata一级站亭数据
//和修改站牌不一样的是：ZT修改时，由于不涉及到ZP的数据，仅仅只需要对zp的主键进行变化
function  modifZtJsonData(ztkey,newdata,newpklist) {
    var ztkeyArr = ztkey.split('_');
    var ztid = ztkeyArr[0];
    var ztpk = ztkeyArr[1];
    var ztobj = jsondata[ztkey];
    var newztpk = newpklist.ztpk;
    var newztkey = ztid + "_" + newztpk;
    var old_zpkeylist=[];//需要将之前所有站牌的KEY存到数据里面，以便后续修改HTML时进行循环
    var new_zpkeylist =[];//修改站点对象时，renturn_zpkeylist 应为一个数组，对
    if (newztkey != ztkey){
        var ztobj_tmp = jsondata[ztkey];//需要将旧的ZT对象取到临时对象中进行重新赋值
        var zppkzpidlb = newpklist.zppkzpidlb;
        var zppkzpidArr = zppkzpidlb.split(";");
        var newzpkeylist = [];
        old_zpkeylist = ztobj_tmp.zpkeys;
        //站亭修改时，需要对所有的站牌主键进行回填。。
        //循环里面需要取去返回值的PK和ID，通过ID对应判断来更改新的ZPKEY
        for(var zz=0;zz<zppkzpidArr.length;zz++){
            if(zppkzpidArr[zz]=="") continue;
            var oldzpkey = ztobj_tmp.zpkeys[zz];//旧ztobj中的zpkeys.length 应该和返回的zppkzpidArr.length 一致，否则肯定是哪里有问题
            var zpid = oldzpkey.split("_")[0];
            var zppk =  oldzpkey.split("_")[1];
            var newzpkey = zppkzpidArr[zz];
            var currzpid = newzpkey.split("_")[0];
            var currzppk =  newzpkey.split("_")[1];
            newzpkeylist.push(newzpkey);
            var zpobj_tmp = ztobj_tmp.zps[oldzpkey];
            //当ZPID都为-1时，为新建灯箱的修改，此时ZPPK肯定一致
            //修改已有ZPID的，数据库会产生新的ZPPK，而页面存储的是ZPPK=-1，则需要判断ZPID是否一致
            var isnewzp = false;//新站牌时候，判断ZPPK
            if (zpid == currzpid && zpid == -1) isnewzp = true;
            if (isnewzp) {
                if (currzppk == zppk) {//新站牌时候，需要判断PK
                    zpobj_tmp.zp_pk_fgs=currzppk;
                    ztobj_tmp.zps[newzpkey] = zpobj_tmp;
                    delete  ztobj_tmp.zps[oldzpkey];
                }
            } else if (currzpid == zpid) {
                //只对该修改行的ZP进行重新赋值，其他的取原对象，改变主键即可
                zpobj_tmp.zp_pk_fgs=currzppk;
                ztobj_tmp.zps[newzpkey] = zpobj_tmp;
                delete  ztobj_tmp.zps[oldzpkey];
            }

        }
        //对ZT修改的数据进行回填
        for (var item in newdata) {
            var key = item;
            ztobj_tmp[key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
        }
        ztobj_tmp.zt_pk_fgs =newztpk;
        ztobj_tmp.zpkeys = newzpkeylist;
        new_zpkeylist = newzpkeylist;
        ztobj_tmp.xgzt ="待审";
        jsondata[newztkey] = ztobj_tmp;
        //最后删除旧主键
        delete jsondata[ztkey];
    }
    else
    {    //相同ZTKEY的时候，不需要做其他处理直接赋值即可
        // 因为站亭主键一致，站牌主键不可能不一致
        old_zpkeylist = ztobj.zpkeys;
        new_zpkeylist = ztobj.zpkeys;
        for (var item in newdata) {
            var key = item;
            jsondata[ztkey][key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
        }
        jsondata[ztkey].xgzt="待审";
        //也不需要对HTML的TR进行主键的重新赋值，所以old_zpkeylist 长度为0，不必循环即可
    }
    return [ztkey,old_zpkeylist,newztkey,new_zpkeylist];
}
function  modifZtJsonData_delzd(ztkey,newdata,newpklist) {
    var ztkeyArr = ztkey.split('_');
    var ztid = ztkeyArr[0];
    var ztpk = ztkeyArr[1];
    var ztobj = jsondata[ztkey];
    var newztpk = newpklist.ztpk;
    var newztkey = ztid + "_" + newztpk;
    var old_zpkeylist=[];//需要将之前所有站牌的KEY存到数据里面，以便后续修改HTML时进行循环
    var new_zpkeylist =[];//修改站点对象时，renturn_zpkeylist 应为一个数组，对
    if (newztkey != ztkey){
        var ztobj_tmp = jsondata[ztkey];//需要将旧的ZT对象取到临时对象中进行重新赋值
        var newzpkeylist = [];
        old_zpkeylist = ztobj_tmp.zpkeys;

        ztobj_tmp.zt_pk_fgs =newztpk;
        ztobj_tmp.zpkeys = newzpkeylist;
        new_zpkeylist = newzpkeylist;
        ztobj_tmp.xgzt ="待审";
        jsondata[newztkey] = ztobj_tmp;
        //最后删除旧主键
        delete jsondata[ztkey];
    }
    else
    {    //相同ZTKEY的时候，不需要做其他处理直接赋值即可
        // 因为站亭主键一致，站牌主键不可能不一致
        old_zpkeylist = ztobj.zpkeys;
        new_zpkeylist = ztobj.zpkeys;
        for (var item in newdata) {
            var key = item;
            jsondata[ztkey][key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
        }
        jsondata[ztkey].xgzt="待审";
        //也不需要对HTML的TR进行主键的重新赋值，所以old_zpkeylist 长度为0，不必循环即可
    }
    return [ztkey,old_zpkeylist,newztkey,new_zpkeylist];
}
//修改jsondata二级站牌数据
function  modifZpJsonData(ztkey,zpkey,newdata,newpklist) {
    var ztkeyArr = ztkey.split('_');
    var ztid = ztkeyArr[0];
    var ztpk = ztkeyArr[1];
    var zpkeyArr = zpkey.split("_");
    var zpid = zpkeyArr[0];
    var zppk = zpkeyArr[1];
    var trid = zpkey + "_" + ztkey;
    var ztobj = jsondata[ztkey];
    var zpobj = ztobj.zps[zpkey];
    var newztpk = newpklist.ztpk;
    var newztkey = ztid + "_" + newztpk;
    var oldzpkeylist =[];
    var return_zpkey =[];
    if (newztkey != ztkey){
        var ztobj_tmp = jsondata[ztkey];//需要将旧的ZT对象取到临时对象中进行重新赋值
        var zppkzpidlb = newpklist.zppkzpidlb;
        var zppkzpidArr = zppkzpidlb.split(";");
        var newzpkeylist = [];
        //循环里面需要取去返回值的PK和ID，通过ID对应判断来更改新的ZPKEY
        for(var zz=0;zz<zppkzpidArr.length;zz++){
            if(zppkzpidArr[zz]=="") continue;
            var oldzpkey = ztobj_tmp.zpkeys[zz];//旧ztobj中的zpkeys.length 应该和返回的zppkzpidArr.length 一致，否则肯定是哪里有问题
            oldzpkeylist.push(oldzpkey);
            var newzpkey = zppkzpidArr[zz];
            var currzpid = newzpkey.split("_")[0];
            var currzppk =  newzpkey.split("_")[1];
            newzpkeylist.push(newzpkey);
            var zpobj_tmp = ztobj_tmp.zps[oldzpkey];

            if(zpid == currzpid) {//当前修改行，需要重新赋值
                //当ZPID都为-1时，为新建灯箱的修改，此时ZPPK肯定一致
                //修改已有ZPID的，数据库会产生新的ZPPK，而页面存储的是ZPPK=-1，则需要判断ZPID是否一致
                var isnewzp = false;//新站牌时候，判断ZPPK
                if (zpid == currzpid && zpid == -1) isnewzp = true;
                if (isnewzp) {
                    if (currzppk == zppk) {//新站牌时候，需要判断PK
                        //只对该修改行的ZP进行重新赋值，其他的取原对象，改变主键即可
                        for (var item in newdata) {
                            var key = item;
                            zpobj_tmp[key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
                        }
                        zpobj_tmp.zp_pk_fgs=currzppk;
                        ztobj_tmp.zps[newzpkey] = zpobj_tmp;
                        return_zpkey.push(newzpkey);
                        delete  ztobj_tmp.zps[oldzpkey];
                    }
                } else if (currzpid == zpid) {
                    //只对该修改行的ZP进行重新赋值，其他的取原对象，改变主键即可
                    for (var item in newdata) {
                        var key = item;
                        zpobj_tmp[key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
                    }
                    zpobj_tmp.zp_pk_fgs=currzppk;
                    ztobj_tmp.zps[newzpkey] = zpobj_tmp;
                    return_zpkey.push(newzpkey);
                    delete  ztobj_tmp.zps[oldzpkey];
                }
            }
            else{//并非当前修改行，则需要删除对象重新创建
                ztobj_tmp.zps[newzpkey] = zpobj_tmp;
                return_zpkey.push(newzpkey);
                delete  ztobj_tmp.zps[oldzpkey];
            }

        }
        ztobj_tmp.zpkeys = newzpkeylist;
        ztobj_tmp.zt_pk_fgs =newztpk;
        ztobj_tmp.xgzt ="待审";
        jsondata[newztkey] = ztobj_tmp;
        //最后删除旧主键
        delete jsondata[ztkey];
    }
    else
     {   //相同ZTKEY的时候，不需要做其他处理直接赋值即可
         var ztobj_tmp = jsondata[ztkey];//需要将旧的ZT对象取到临时对象中进行重新赋值
         var zppkzpidlb = newpklist.zppkzpidlb;
         var zppkzpidArr = zppkzpidlb.split(";");
         var newzpkeylist = [];
         //循环里面需要取去返回值的PK和ID，通过ID对应判断来更改新的ZPKEY
         for(var zz=0;zz<zppkzpidArr.length;zz++) {
             if(zppkzpidArr[zz]=="") continue;
             if(zpkey == zppkzpidArr[zz])
             {
                 oldzpkeylist.push(zpkey);
                 return_zpkey.push(zpkey);
                 // 因为站亭主键一致，站牌主键不可能不一致
                 for (var item in newdata) {
                     var key = item;
                     jsondata[ztkey].zps[zpkey][key] = newdata[key];//对主键的重新赋值，如果主键不存在则自动创建
                 }
             }
         }
         jsondata[ztkey].xgzt="待审";

    }
    return [ztkey,oldzpkeylist,newztkey,return_zpkey];
}