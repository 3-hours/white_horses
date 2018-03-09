//全局变量
var city = art.dialog.data("post_csm"); //城市名
var jc = art.dialog.data("post_jc"); //城市简称
$(function () {
    $('#before_jc').text(jc);
    $('.before-zpbh').text(jc);
    //行政区域
    var xzqyjson =  getJsonWithUrl(window.httplink+"/" +"option_xzqy","&csm="+encodeURI(city));
    if(xzqyjson && xzqyjson.code=="0")
        CreatSingle_Hao_Select(100,"option_xzqy_div","行政区域",xzqyjson.data,"xzqy");
    else
        ErrorSelectHao("option_xzqy_div");
    //站点方位
    var zdfwjson =  getJsonWithUrl(window.httplink+"/" +"option_zdfw","");
    if(zdfwjson && zdfwjson.code=="0")
        CreatSingle_Hao_Select(87,"option_zdfw_div","站点方位",zdfwjson.data,"zdfw");
    else
        ErrorSelectHao("option_zdfw_div");
    //灯箱款式
    var dxksjson =  getJsonWithUrl(window.httplink+"/" +"option_dxks","&csm="+encodeURI(city));
    if(dxksjson && dxksjson.code=="0")
        CreatSingle_Hao_Select(86,"option_dxks_div","灯箱款式",dxksjson.data,"ksmc");
    else
        ErrorSelectHao("option_dxks_div");
    //灯箱类型
    var dxlxjson =  getJsonWithUrl(window.httplink+"/" +"option_ztlx","&csm="+encodeURI(city));
    if(dxlxjson && dxlxjson.code=="0")
        CreatSingle_Hao_Select(86,"option_dxlx_div","灯箱类型",dxlxjson.data,"lxmc");
    else
        ErrorSelectHao("option_dxlx_div");

    //特殊
    //灯箱来源
    var dxlyjson =  getJsonWithUrl(window.httplink+"/" +"option_ztqs","");
    if(dxlyjson && dxlyjson.code=="0")
        CreatDxlySelect(280,"option_dxly_div","灯箱来源",dxlyjson.data,"dxqs");
    else
        ErrorSelectHao("option_dxly_div");
    //供电方式和日期
    var gdfsjson =  getJsonWithUrl(window.httplink+"/" +"option_gdfs","");
    if(gdfsjson && gdfsjson.code=="0")
        CreatGdfsSelect(280,"option_gdfs_div","供电方式和日期",gdfsjson.data,"gdly");
    else
        ErrorSelectHao("option_dxly_div");

    //站牌朝向
    zpcx_all();
    //灯箱规格
    dxgg_all();
    //特殊属性
    tssx_all();


    //站亭编号---输入//打对勾的那个
    $('#input_zdbh').change(function () {
        var ztbh =$.trim($('#input_zdbh').val());
        var jc = $('#before_jc').text();
        var jc_next = $('#lx_s').text();
        var ztbh_all = jc + jc_next + ztbh;
        if( (/^\d{4}$/).test(ztbh) ){
            $.ajax({
                url: window.httplink+"/" +"check_ztbh",
                type: "POST",
                async: false,
                data:{
                    "ztbh":ztbh_all,
                },
                dataType: "html",
                success: function (result) {
                    console.log(result);
                    var mydata = eval('(' + result + ')');
                    if(mydata.code=="0")
                    {//修改成功
                        $("#hint").html("✔").css("color","green");
                        $('.zpbh_ss').text(ztbh);
                        $('#zdbh_all').val( $('#before_jc').text() + $('#lx_s').text() + $.trim($('#input_zdbh').val()));
                    }
                    else{
                        menuShowDialogTips(mydata.msg);
                        $('#input_zdbh').val('站点编号');
                        $("#hint").html("×").css("color","red");
                        $('#input_zdbh').focus();
                    }
                },
                error:function (result) {
                    menuShowDialogTips("修改失败");
                    $('#input_zdbh').val('站点编号');
                    $("#hint").html("×").css("color","red");
                    $('#input_zdbh').focus();
                }
            });
        }else {
            menuShowDialogTips('输入的站点编号不符合规则');
            $('#input_zdbh').val('站点编号');
            $("#hint").html("×").css("color","red");
            $('#input_zdbh').focus();
        }
    });

    bindInput();
    bindSelect();

    //新增灯箱
    $('#addnew').click(function () {
        var xuhao = $('.num:last').text();
        var i = parseInt($('.num:last').text());
        (xuhao == '') ?  i=1 : i+=1;

        var dot = '.';
        var ele = $(' <li><span class="num">'+ i +'</span>&nbsp;' +
                    '<span   class="before-zpbh"></span><span class="lx_ss">B</span><span class="zpbh_ss"></span>&nbsp;' +
                    '<input  id="option_dxbh_'+ i +'"     class="choose_dxbh box2 inputType dx_num" type="text" value="灯箱编号" default="灯箱编号">&nbsp;' +

                    '<input  id="option_dxgg_'+ i +'"     class="choose_dxgg box2 selectType" type="text"  value="灯箱规格" default="灯箱规格" readonly>&nbsp;' +
                    '<div    id="option_dxgg_'+ i +'_div" class="choose_dxgg_div sortWrapper absolute_box none"></div>' +

                    '<input  id="option_zpcx_'+ i +'"     class="choose_zpcx box2 selectType" type="text"  value="站牌朝向" default="站牌朝向" readonly>&nbsp;' +
                    '<div    id="option_zpcx_'+ i +'_div" class="choose_zpcx_div sortWrapper absolute_box none"></div>' +

                    '<input  id="option_tssx_'+ i +'"     class="choose_tssx box3 selectType" type="text"  value="特殊属性" default="特殊属性" readonly>&nbsp;' +
                    '<div    id="option_tssx_'+ i +'_div" class="choose_tssx_div sortWrapper absolute_box none"></div>' +

                    '<input  id="option_jzrq_'+ i +'" class="Wdate choose_jzrq"  type="text"  placeholder="建牌日期" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})">' +
                    ' <img  class="delete_btn" src="http://wxapp.whadshel.com/testimos/damei/image/forbidden.png" alt="删除">' +
                    '</li>');
        $('#ul').append(ele);
        $('.before-zpbh').text(jc);
        var dxlx_num = $('#lx_s').text();
        $('.lx_ss').text(dxlx_num);
        if( $('#input_zdbh').val() == '站点编号'){
            $('.zpbh_ss').text('');
        }else{
            $('.zpbh_ss').text( $.trim($('#input_zdbh').val()) );
        }
        bindInput();
        bindSelect();
        //站牌朝向
        zpcx_all();
        //灯箱规格
        dxgg_all();
        //特殊属性
        tssx_all();
        choose_move();
    });

    choose_move();
    //删除灯箱按钮事件,改变所有input,div的id值
    function choose_move(){
        $('.delete_btn').each(function () {
            $(this).on('click',function(){
                $(this).parent().remove();
                var i = 1;
                $('.num').each(function () {
                    $(this).text( i++);
                    $(this).siblings('input').attr('id');
                });
                $('li .choose_dxbh').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_dxgg').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_zpcx').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_tssx').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_jzrq').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_dxgg_div').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_zpcx_div').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
                $('li .choose_tssx_div').each(function () {
                    var id_num = $(this).siblings('span.num').text();
                });
            })
        });
    }


});


//获得鼠标点击的横纵坐标
function getPos(id) {
    var thisX = $('#'+id).position().left;
    var thisY = $('#'+id).position().top;
    return {'left_s':thisX,'top_s':thisY};
}

//站亭来源
function CreatDxlySelect(width,divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        $('#'+divid).css({'width':width});

        var optioncssname = divid+"_option";
        var optioncssname1 = divid+"_option1";
        var closecssname = divid+"_close";
        var optionhtml = "<div style='position: relative'>" +
            "<div class='left'  id='ztly_inner' style='width: 90%;margin-right: 1%;margin-left: 4%'></div>" +
            "<div class='right'><input id='ztly_inner_input' type='text' placeholder='输入站点来源' " +
            "style='position:absolute;bottom:5px;right:20px;width: 180px;height: 100px;margin-top: 20px;'></div>" +
            "</div><span  class='btn_inner' style='float: right;margin:5px 20px 10px 0' id='sure_ztly'>确定</span>";
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var left_ztly = '';
        for(var i=0;i<json.length;i++){
            if( i == 0) {
                left_ztly += "<a style='display: block;width:30px;' class=\"sort cursor "+optioncssname1+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a><hr>" ;
            }else {
                left_ztly += "<a style='display: block;width:30px;' class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>" +
                    "<input type='hidden' value='"+ i +"'>" ;
            }
        }
        $("#"+divid).html("").append(closehtml).append(optionhtml);
        $("#ztly_inner").append(left_ztly);
        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
            })
        });
        $("."+optioncssname1).click(function () {
            $(this).parent().parent().parent().hide();
            $("#"+divid).prev().val($(this).text());
            //对兄弟元素样式重置
            $("#ztly_inner_input").val('');
            $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                $("#ztly_inner_input").val('');
                $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
                var i = parseInt($(this).next().val()) -1;
                //确定按钮
                $("#sure_ztly").click(function () {
                    if( $.trim($("#ztly_inner_input").val()) == '' ){
                        $("#ztly_inner_input").focus();
                        return;
                    }
                    $("#" + divid).hide();
                    $("#" + divid).prev().val($('.' + optioncssname + ':eq(' + i + ')').text() + ';' + $.trim($("#ztly_inner_input").val()));

                })

            });
        })
    }
}

//供电方式和日期
function CreatGdfsSelect(width,divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        $('#'+divid).css({'width':width});
        var optioncssname = divid+"_option";
        var optioncssname1 = divid+"_option1";
        var closecssname = divid+"_close";
        var optionhtml = "<div style='position: relative;' id='gdfs_inner'>" +
            "<input  id='input_tdrq_inner' class='Wdate' style='position: absolute;right: -10px;top:10px' type='text' placeholder='请选择日期' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\">" +
            "</div><span id='sure_gdfs' class='btn_inner' style='float: right;margin-right: 20px;margin-top: -5px'>确定</span>";
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var gdfs_option = '';
        for(var i=0;i<json.length;i++){
            var j = parseInt(json.length) -1;
            if (i != j) {
                gdfs_option +="<a style='display: block;width: 60px;text-align: center' class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>" +
                    "<input type='hidden' value='"+i+"'>";
            }else {
                gdfs_option +="<hr><a style='margin-top: 0;width: 60px;text-align: center' class=\"sort cursor "+optioncssname1+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
            }
        }
        $("#"+divid).html("").append(closehtml).append(optionhtml);
        $('#gdfs_inner').append(gdfs_option);

        //$("#input_tdrq_inner").val('').attr('disabled',true).css({'background-color':'#ccc'});

        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
                $("#input_tdrq_inner").val('').attr('disabled',true).css({'background-color':'#ccc'});
            })
        });
        $("."+optioncssname1).click(function () {
            $(this).parent().parent().hide();
            $("#"+divid).prev().val($(this).text());
            //对兄弟元素样式重置
            $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
            $("#input_tdrq_inner").val('').attr('disabled',true).css({'background-color':'#ccc'});
        });
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                $("#input_tdrq_inner").val('').attr('disabled',false).css({'background-color':'#fff'});
                $(this).addClass("typeSelected").siblings().removeClass("typeSelected");
                var i = parseInt($(this).next().val()) ;
                //确定按钮
                $("#sure_gdfs").click(function () {
                    if( $.trim($("#input_tdrq_inner").val()) == '' ){
                        $("#input_tdrq_inner").focus();
                        return;
                    }
                    $("#" + divid).hide();
                    $("#" + divid).prev().val($('.' + optioncssname + ':eq(' + i + ')').text() + ';' + $.trim($("#input_tdrq_inner").val()));
                    $("#input_tdrq_inner").val('').attr('disabled',true).css({'background-color':'#ccc'});
                })

            });
        })
    }
}

//普通
function CreatSingle_Hao_Select(width,divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        $('#'+divid).css({'width':width});

        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var optionhtml = "";
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
                //灯箱类型发生变化时,改变编号
                if( title == '灯箱类型') {
                    var dxlx_ss = $(this).text();
                    var dxlx_num = dxlx_ss.substr(0, 1);
                    $('#lx_s').text(dxlx_num);
                    $('.before-zpbh').text(jc);
                    $('.lx_ss').text(dxlx_num);
                }
                $(this).parent().hide();
            });
        })
    }
}

//特殊属性
function CreatSingleTssxSelect(width,divid,title,json,optionkey) {
    if(json.length==0)
    {
        ErrorSelect(divid);
    }
    else
    {
        var str = divid;
        //获取div对应的input的id值
        var s1 = str.substring(0,str.length-4);
        //获取最后那个数字
        var s0 = s1.slice(12);

        //对div宽度进行设置
        $('#'+divid).css({'width':width});

        var optioncssname_s = divid+"_option_s";
        var optioncssname = divid+"_option";
        var closecssname = divid+"_close";
        var optionhtml = "";
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        for(var i=0;i<json.length;i++){
            if (i == 0) {
                optionhtml +="<a class=\"sort cursor "+optioncssname_s+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
            }else {
                optionhtml +="<a class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>";
            }
        }
        var btnshtml = "<span  id='sure_tssx_"+ s0 +"'  class='btn_inner' style='margin-top: 10px'>确定</span>" +
                       "<span  id='clear_tssx_"+ s0 +"' class='btn_inner' style='margin-top: 10px'>清除</span>";
        $("#"+divid).html("").append(closehtml).append(optionhtml).append(btnshtml);
        $("."+closecssname).each(function () {
            $(this).on("click",function () {
                $(this).parent().parent().hide();
            })
        });
        //滚动
        $("."+optioncssname_s).each(function () {
            $(this).on("click",function () {
                $(this).addClass("typeSelected");
            });
        });
        //正面不能上画和背面不能上画
        $("."+optioncssname).each(function () {
            $(this).on("click",function () {
                $(this).addClass("typeSelected").siblings("."+optioncssname).removeClass("typeSelected");
            });
        });

        $('#sure_tssx_'+s0).on("click",function () {
            var arr = new Array();
            $('#'+divid+' .typeSelected').each(function(){
                arr.push($(this).text());
            });
            var str = arr.join(',');
            if( str != ''){
                $('#'+divid).prev().val(str);
            }else{
                $('#'+divid).prev().val('特殊属性');
            }
            $(this).parent().hide();
        });

        $('#clear_tssx_'+s0).on("click",function () {
            $(this).parent().prev().val('特殊属性');
            $(this).siblings('a').removeClass("typeSelected");
        });
    }
}

//inputType
function bindInput() {
    $(".inputType").each(function () {
        $(this).on("click",function () {
            if($(this).val()== $(this).attr("default"))
                $(this).val("");
        });
        $(this).blur(function () {
            if($(this).val()==""){
                $(this).val($(this).attr("default"));
            }
        });
    });
}
//selectType
function bindSelect() {
    $(".selectType").each(function () {
        var id = $(this).attr("id");
        var divid = id+"_div";
        $(this).on("click",function () {
            var this_id = $(this).attr('id');

            var POS = getPos(this_id);
            var POSx = POS.left_s;
            var POSy = parseInt(POS.top_s) +32;

            $(".sortWrapper").hide();
            //显示选项对应的DIV
            $("#"+divid).show();
            $('#'+divid).css({'left':POSx,'top':POSy});
            //还需要对已选择项高亮显示在选择DIV中
            // if($(this).val()!= $(this).attr("default"))
            // {
            var inputvalue = $(this).val();
            $("#"+divid).find("a").each(function () {
                if($(this).attr("data-val")==inputvalue)
                {
                    $(".typeSelected").removeClass("typeSelected");
                    $(this).addClass("typeSelected");
                }
            });

        });
    });
}
//错误的下拉选择
function  ErrorSelectHao(divid) {
    var str = divid;
    var s1 = str.substring(0,str.length-4);
    var POS = getPos(s1);
    var POSx = POS.left_s;
    var POSy = parseInt(POS.top_s);
    $('#'+divid).css({'left':POSx,'top':POSy});

    var inputid = divid.replace("_div","");
    var closehtml  ="<div class=\"caneal close_s fr\">X</div>";
    var errorhtml ="<div>选项加载错误，请刷新页面重新请求数据</div>";
    $("#"+divid).html("").append(closehtml).append(errorhtml);
    $(".close_s").each(function () {
        $(this).on("click",function () {
            $(this).parent().hide();
        })
    });
}
//站牌朝向
function zpcx_all() {

    var zpcxjson =  getJsonWithUrl(window.httplink+"/" +"option_zpcx","");
    var q = parseInt($('.num:last').text());
    for (var k=0;k<q;k++){
        var num_q = k+1;
        if(zpcxjson && zpcxjson.code=="0")
            CreatSingle_Hao_Select(86,"option_zpcx_"+ num_q +"_div","站牌朝向",zpcxjson.data,"zpcx");
        else
            ErrorSelectHao("option_zpcx_"+ num_q +"_div");
    }
}
//灯箱规格
function dxgg_all() {
    var dxggjson =  getJsonWithUrl(window.httplink+"/" +"option_ggh","&csm="+encodeURI(city));
    var q = parseInt($('.num:last').text());
    for (var k=0;k<q;k++){
        var num_q = k+1;
        if(dxggjson && dxggjson.code=="0")
            CreatSingle_Hao_Select(86,"option_dxgg_"+ num_q +"_div","灯箱规格",dxggjson.data,"ggmc");
        else
            ErrorSelectHao("option_dxgg_"+ num_q +"_div");
    }
}
//特殊属性
function tssx_all() {
    var tssxjson =  getJsonWithUrl(window.httplink+"/" +"option_tssx","");
    var q = parseInt($('.num:last').text());
    for (var k=0;k<q;k++){
        var num_q = k+1;
        if(tssxjson && tssxjson.code=="0")
            CreatSingleTssxSelect(136,"option_tssx_"+ num_q +"_div","特殊属性",tssxjson.data,"sxmc");
        else
            ErrorSelectHao("option_tssx_"+ num_q +"_div");
    }
}
//站亭保存
$('#submit').click(function () {
    var dxly = $.trim( $('#option_dxly').val() );
    var dxlx = $.trim( $('#option_dxlx').val() );
    var zdbh = $.trim( $('#input_zdbh').val() );
    var zm = $.trim( $('#input_zm').val() );

    var xzqy = $.trim( $('#option_xzqy').val() );
    var lm = $.trim( $('#input_lm').val() );
    var fw = $.trim( $('#option_zdfw').val() );
    var fjbzw = $.trim( $('#input_fjbzw').val() );

    var gdfs = $.trim( $('#option_gdfs').val() );
    var dxks = $.trim( $('#option_dxks').val() );

    var jzrq   = $.trim( $('#input_bulidtime').val() );

    var dxly_Bol = false;
    if ( dxly != '灯箱来源' && dxly != '' ){
        dxly_Bol = true;
    }else {
        $('#option_dxly').focus();
        return;
    }

    var dxlx_Bol = false;
    if ( dxlx != '灯箱类型' && dxlx != '' ){
        dxlx_Bol = true;
    }else {
        $('#option_dxlx').focus();
        return;
    }

    var zdbh_Bol = false;
    if ( zdbh != '站点编号' && zdbh != '' ){
        zdbh_Bol = true;
    }else {
        $('#input_zdbh').focus();
        return;
    }

    var zm_Bol = false;
    if ( zm != '站名' && zm != '' ){
        zm_Bol = true;
    }else {
        $('#input_zm').focus();
        return;
    }

    var xzqy_Bol = false;
    if ( xzqy != '行政区域' && xzqy != '' ){
        xzqy_Bol = true;
    }else {
        $('#option_xzqy').focus();
        return;
    }

    var lm_Bol = false;
    if ( lm != '路名' && lm != '' ){
        lm_Bol = true;
    }else {
        $('#input_lm').focus();
        return;
    }

    var fw_Bol = false;
    if ( fw != '方位' && fw != '' ){
        fw_Bol = true;
    }else {
        $('#option_zdfw').focus();
        return;
    }

    var fjbzw_Bol = false;
    if ( fjbzw != '附近标志物' && fjbzw != '' ){
        fjbzw_Bol = true;
    }else {
        $('#input_fjbzw').focus();
        return;
    }

    var gdfs_Bol = false;
    if ( gdfs != '供电方式和日期' && gdfs != '' ){
        gdfs_Bol = true;
    }else {
        $('#option_gdfs').focus();
        return;
    }

    var dxks_Bol = false;
    if ( dxks != '灯箱款式' && dxks != '' ){
        dxks_Bol = true;
    }else {
        $('#option_dxks').focus();
        return;
    }

    var jzrq_Bol = false;
    if ( jzrq != '' ){
        jzrq_Bol = true;
    }else {
        $('#input_bulidtime').focus();
        return;
    }


    //灯箱来源的设置
    var dxly_type = '';
    var dxjzfs = '';
    var dxly_s = '';
    if(dxly != '自建'){
        dxly_type = dxly.split(";");

        dxjzfs = dxly_type[0];
        dxly_s = dxly_type[1];
    }else {
        dxjzfs = dxly;
        dxly_s = '';
    }

    //通电方式的设置
    var gdfs_type = '';
    var dxtdfs = '';
    var tdrq = '';
    if(gdfs != '未通电'){
        gdfs_type = gdfs.split(";");

        dxtdfs = gdfs_type[0];
        tdrq = gdfs_type[1];
    }else {
         dxtdfs = gdfs;
         tdrq = '';
    }

    if(dxly_Bol && dxlx_Bol && zdbh_Bol && zm_Bol && xzqy_Bol && lm_Bol && fw_Bol && fjbzw_Bol && gdfs_Bol && dxks_Bol  == true){

        var li_ele = $('li');
       li_ele.each(function(index,item){
           $(this).addClass("hasvalue");
           $(this).children('input').each(function(index,item){
               if( $(this).val().indexOf('站牌朝向') > -1 ){

                    $(this).parent().removeClass("hasvalue");

               }else if( $(this).val().indexOf('灯箱编号') > -1 || $(this).val() == ''){

                   $(this).parent().removeClass("hasvalue");

               }else if ( $(this).val().indexOf('灯箱规格') > -1 ){

                   $(this).parent().removeClass("hasvalue");

               }else if ( $(this).val() == '' ) {

                   $(this).parent().removeClass("hasvalue");

               }
           })
       })

        var inputs = $('li.hasvalue input');

        var zpxxlb = '';
        inputs.each(function(index,item){
            var i = index +1;
           if( $(this).attr("id").indexOf('dxbh') > -1){

               zpxxlb += ( $('#zdbh_all').val() + '-' + $(this).val() ) + ',' + $(this).val() + ',';

           }else if( $(this).attr("id").indexOf('tssx') > -1 ){
                var dmdx = '';
                var cg = '';
               if( $(this).val() == '特殊属性'){
                   cg = '常规';
                   dmdx = '';
                   zpxxlb += cg +',' + dmdx + ',';
               }else if ( $(this).val() == '滚动' ){
                   cg = '滚动';
                   dmdx = '';
                   zpxxlb += cg + ',' + dmdx +',';
               }else if( $(this).val() == '正面不能上画' ){
                   cg = '常规';
                   dmdx = '正面不能上画';
                   zpxxlb += cg + ',' + dmdx +',';
               }else if( $(this).val() == '背面不能上画' ){
                   cg = '常规';
                   dmdx = '背面不能上画';
                   zpxxlb += cg + ',' + dmdx +',';
               }else {
                   var tesx_s = $(this).val().split(',');
                   zpxxlb += tesx_s[0] + ',' + tesx_s[1] + ',';
               }

           }else if( i%5 == 0){

               zpxxlb += $(this).val() +';';

           }else {
               zpxxlb += $(this).val() +',';
           }
        });
        if( zpxxlb == ''){
            menuShowDialogTips("请新增灯箱再保存!");
            return;
        }
        $.ajax({
            url: window.httplink+"/" +"ztzpadd",
            type: "POST",
            async: false,
            data:{
                "userid" : art.dialog.data("post_userid"),
                "csm"    : art.dialog.data("post_csm"),
                "ztbh"   : $('#before_jc').text() + $('#lx_s').text() + zdbh,
                "zm"     : zm,
                "lm"     : lm,
                "xzqy"   : xzqy,
                "fjbzw"  : fjbzw,
                "zdfw"   : fw,
                "dxlx"   : dxlx.substr(2),
                "dxjzfs" : dxjzfs,
                "dxly"   : dxly_s,
                "jtrq"   : jzrq,
                "dxtdfs" : dxtdfs,
                "tdrq"   : tdrq,
                'ksmc'   : dxks,
                'zpxxlb' : zpxxlb
            },
            dataType: "html",
            success: function (result) {
                var mydata = eval('(' + result + ')');
                if(mydata.code=="0")
                {
                    //修改成功
                    menuShowDialogTips("保存成功");
                    artDialog.close();
                }
                else{
                    menuShowDialogTips(mydata.msg);
                }
            },
            error:function (result) {
                menuShowDialogTips("保存失败");
            }
        });
    }
})