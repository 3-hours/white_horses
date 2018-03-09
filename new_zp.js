//全局变量
var ztpk = '';
var ztid = '';
$(function () {
    var city = art.dialog.data("post_csm"); //城市名
    var ztdata = art.dialog.data("post_ztobj"); //json数据

    $('#zpbh_s').text(ztdata.ztbh); //站亭编号
    $('#zhan-name').text(ztdata.zm);//站名
    $('#area').text(ztdata.xzqy);//行政区域
    $('#road-name').text(ztdata.lm);//路名

    if(ztdata.fjbzw == '' || ztdata.fjbzw == null){
        $('#symbol').text('');//附近标志物
    }else{
        $('#symbol').text(ztdata.fjbzw);//附近标志物
    }

    $('#direction').text(ztdata.zdfw);//方位

    //获取序号
    $.ajax({
        url: window.httplink+"/" +"ztquery",
        type: "POST",
        data:{
            "userid":art.dialog.data("post_userid"),
            "csm":city,
            "cksc":"N",
            "ztbh":ztdata.ztbh
        },
        success: function (result) {
            var result_s = eval('(' + result + ')');
            var data = result_s.data;
            var data_xuhao = 0;
            $.each(data, function (index,item) {
                data_xuhao++;
            });
            if(data_xuhao > 0){
                var xh_len = data_xuhao +1;
                $('#num_xuhao').text(xh_len); //序号
                //自动填入位置编号
                var this_wzbh = parseInt( $('#num_xuhao').text() );
                if(this_wzbh < 100) {
                    if(this_wzbh < 10 ) {
                        this_wzbh = '00'+this_wzbh;
                    }else {
                        this_wzbh = '0'+this_wzbh;
                    }
                }
                $('#option_dxbh').val(this_wzbh);
                //
                ct_check();//冲突检测
                //
            }else{
                var xh_len = 1;
                $('#num_xuhao').text(xh_len); //序号
                $('#option_dxbh').val('001');
            }
        },
        error:function (result) {
            //menuShowDialogTips(result);
        }
    });

    $('#jc_all').text(ztdata.ztbh); //湘B

    bindInput();
    bindSelect();

    //灯箱款式
    var dxksjson =  getJsonWithUrl(window.httplink+"/" +"option_dxks","&csm="+encodeURI(city));
    if(dxksjson && dxksjson.code=="0")
        CreatSingle_Hao_Select(116,"option_dxks_div","灯箱款式",dxksjson.data,"ksmc");
    else
        ErrorSelectHao("option_dxks_div");
    //灯箱类型
    var dxlxjson =  getJsonWithUrl(window.httplink+"/" +"option_ztlx","&csm="+encodeURI(city));
    if(dxlxjson && dxlxjson.code=="0")
        CreatSingle_Hao_Select(116,"option_dxlx_div","灯箱类型",dxlxjson.data,"lxmc");
    else
        ErrorSelectHao("option_dxlx_div");

    //特殊
    //建造类型和灯箱来源
    var dxlyjson =  getJsonWithUrl(window.httplink+"/" +"option_ztqs","");
    if(dxlyjson && dxlyjson.code=="0")
        CreatDxlySelect(280,"option_dxly_div","建造类型和灯箱来源",dxlyjson.data,"dxqs");
    else
        ErrorSelectHao("option_dxly_div");
    //供电方式和日期
    var gdfsjson =  getJsonWithUrl(window.httplink+"/" +"option_gdfs","");
    if(gdfsjson && gdfsjson.code=="0")
        CreatGdfsSelect(280,"option_gdfs_div","供电方式和日期",gdfsjson.data,"gdly");
    else
        ErrorSelectHao("option_dxly_div");

    //站牌朝向
    var zpcxjson =  getJsonWithUrl(window.httplink+"/" +"option_zpcx","");
    if(zpcxjson && zpcxjson.code=="0")
        CreatSingle_Hao_Select(116,"option_zpcx_div","站牌朝向",zpcxjson.data,"zpcx");
    else
        ErrorSelectHao("option_zpcx_div");

    //灯箱规格
    var dxggjson =  getJsonWithUrl(window.httplink+"/" +"option_ggh","&csm="+encodeURI(city));
    if(dxggjson && dxggjson.code=="0")
        CreatSingle_Hao_Select(116,"option_dxgg_div","灯箱规格",dxggjson.data,"ggmc");
    else
        ErrorSelectHao("option_dxgg_div");

    //特殊属性
    var tssxjson =  getJsonWithUrl(window.httplink+"/" +"option_tssx","");
    if(tssxjson && tssxjson.code=="0")
        CreatSingleTssxSelect(116,"option_tssx_div","特殊属性",tssxjson.data,"sxmc");
    else
        ErrorSelectHao("option_tssx_div");

    //灯箱编号---输入
    $('#option_dxbh').change(function () {
        var zpbh =$.trim($('#option_dxbh').val());
        var zpbh_all = ztdata.ztbh + '-' + zpbh;
        if(  (/^\d{3}$/).test(zpbh) ){
            ct_check();//冲突检测
        }else {
            menuShowDialogTips('输入的灯箱编号不符合规则');
            $('#option_dxbh').val('灯箱编号');
            $('#option_dxbh').focus();
        }
    });

    //冲突检测
    function ct_check(){
        var zpbh =$.trim($('#option_dxbh').val());
        var zpbh_all = ztdata.ztbh + '-' + zpbh;
        $.ajax({
            url: window.httplink+"/" +"check_zpbh",
            type: "POST",
            async: false,
            data:{
                "zpbh":zpbh_all
            },
            dataType: "html",
            success: function (result) {
                var mydata = eval('(' + result + ')');
                if(mydata.code=="0")
                {
                    //可以录入
                }
                else{
                    //menuShowDialogTips(mydata.msg);
                    $('#option_dxbh').val('灯箱编号');
                    $('#option_dxbh').focus();
                }
            },
            error:function (result) {
                menuShowDialogTips(result.msg);
                $('#option_dxbh').val('灯箱编号');
                $('#option_dxbh').focus();
            }
        });
    }
    $("#submit").click(function () {
        var xuhao = $('.xuhao:last').text();
        var xh = parseInt( $('.xuhao:last').text() )+1;

        var zpcx = $.trim( $('#option_zpcx').val() );
        var dxbh = $.trim( $('#option_dxbh').val() );
        var dxgg = $.trim( $('#option_dxgg').val() );
        var jzrq = $.trim( $('#input_zp_bulidtime').val() );
        var ly   = $.trim( $('#option_dxly').val() );
        var gdfs = $.trim( $('#option_gdfs').val() );
        var tssx = $.trim( $('#option_tssx').val() );
        var dxlx = $.trim( $('#option_dxlx').val() );
        var dxks = $.trim( $('#option_dxks').val() );

        var ly_Boolean = false;
        if ( ly != '建造类型和灯箱来源' && ly != '' ){
            ly_Boolean = true;
        }else {
            $('#option_dxly').focus();
            return;
        }

        var dxlx_Boolean = false;
        if ( dxlx != '灯箱类型' && dxlx != '' ){
            dxlx_Boolean = true;
        }else {
            $('#option_dxlx').focus();
            return;
        }

        var dxks_Boolean = false;
        if( dxks != '灯箱款式' && dxks != '' ){
            dxks_Boolean = true;
        }else {
            $('#option_dxks').focus();
            return;
        }

        var gdfs_Boolean = false;
        if( gdfs != '供电方式和日期' && gdfs != '' ){
            gdfs_Boolean = true;
        }else {
            $('#option_gdfs').focus();
            return;
        }

        var zpcx_Boolean = false;
        if( zpcx != '站牌朝向' && zpcx != '' ){
            zpcx_Boolean = true;
        }else{
            $('#option_zpcx').focus();
            return;
        }

        var dxbh_Boolean = false;
        if ( dxbh != '灯箱编号' && dxbh != '' ){
            dxbh_Boolean = true;
        }else {
            $('#option_dxbh').focus();
            return;
        }

        var dxgg_Boolean = false;
        if ( dxgg != '灯箱规格' && dxgg != '' ){
            dxgg_Boolean = true;
        }else {
            $('#option_dxgg').focus();
            return;
        }

        var jzrq_Boolean = false;
        if ( jzrq != '建造日期' && jzrq != '' ){
            jzrq_Boolean = true;
        }else {
            $('#input_zp_bulidtime').focus();
            return;
        }

        //建造类型和灯箱来源的设置
        var dxly_type = '';
        var dxjzfs = '';
        var dxly_s = '';

        if(ly != '自建'){
            dxly_type = ly.split(";");
            dxjzfs = dxly_type[0];
            dxly_s = dxly_type[1];
        }else {
            dxjzfs = ly;
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

        //特殊属性未选时传空
        var zpzt = '';
        var dmdx = '';
        if( tssx == '特殊属性'){
            zpzt= '常规';
            dmdx = '';
        }else if(tssx == '滚动'){
            zpzt = '滚动';
            dmdx = '';
        }else if(tssx == '正面不能上画'){
            zpzt = '常规';
            dmdx = '正面不能上画';
        }else if(tssx == '背面不能上画'){
            zpzt = '常规';
            dmdx = '背面不能上画';
        }else {
            var tesx_s = tssx.split(';');
            zpzt = tesx_s[0];
            dmdx = tesx_s[1];
        }

        //判断ztpk是否存在,存在传ztpk.不存在传空
        if( ztdata.zt_pk_fgs){
            ztpk = ztdata.zt_pk_fgs;
        }else if( ztdata.zt_pk){
            ztpk = ztdata.zt_pk;
        }
        //判断ztid是否存在,存在传ztid.不存在传空
        if(ztdata.zt_id_fgs){
            ztid = ztdata.zt_id_fgs;
        }else if( ztdata.zt_id){
            ztid = ztdata.zt_id;
        }
        if( ly_Boolean && dxlx_Boolean && dxks_Boolean && gdfs_Boolean && zpcx_Boolean && dxbh_Boolean && dxgg_Boolean && jzrq_Boolean == true){
            $.ajax({
                url: window.httplink+"/" +"zpadd",
                type: "POST",
                async: false,
                data:{
                    "userid" : art.dialog.data("post_userid"),
                    "csm"    : art.dialog.data("post_csm"),
                    "ztpk"   : ztpk,
                    "ztid"   : ztid,
                    "zpbh"   : ztdata.ztbh +'-'+ dxbh,
                    "dxjzfs" : dxjzfs,
                    "dxly"   : dxly_s,
                    "jtrq"   : jzrq,
                    "ggh"    : dxgg,
                    "dxcx"   : zpcx,
                    "dxlx"   : dxlx.substr(2),
                    "zpzt"   : zpzt,
                    "dmdx"   : dmdx,
                    "wzph"   : dxbh,
                    "ksmc"   : dxks,
                    "dxtdfs" : dxtdfs,
                    "tdrq"   : tdrq
                },
                dataType: "html",
                success: function (result) {
                    var mydata = eval('(' + result + ')');
                    if(mydata.code=="0")
                    {
                        //修改成功
                        //回填ztpk
                        ztpk = mydata.data.ztpk;
                        menuShowDialogTips("保存成功");

                        var ele = $('<tr class="tr_0">' +
                            '<td class="xuhao">'+ xh +'</td>' +
                            '<td>'+ zpcx +'</td>' +
                            '<td>'+ dxbh +'</td>' +
                            '<td>'+ dxgg +'</td>' +
                            '<td>'+ jzrq +'</td>' +
                            '<td>'+ ly +'</td>' +
                            '<td>'+ gdfs +'</td>' +
                            '<td>'+ zpzt +';'+ dmdx +'</td>' +
                            '</tr>');

                        if( $('.tr_0').text() == 1 ){
                            $('.tr_0 td').eq(1).text(zpcx);
                            $('.tr_0 td').eq(2).text(dxbh);
                            $('.tr_0 td').eq(3).text(dxgg);
                            $('.tr_0 td').eq(4).text(jzrq);
                            $('.tr_0 td').eq(5).text(ly);
                            $('.tr_0 td').eq(6).text(gdfs);
                            $('.tr_0 td').eq(7).text(zpzt +';'+ dmdx);
                        }else{
                            $('#table-box').append(ele);
                        }
                        //保存一条成功后,序号自增1
                        var xuhao_len = parseInt($('#num_xuhao').text())+1;
                        $('#num_xuhao').text(xuhao_len);

                        //保存一条成功后,根据以保存的站牌编号自动填入位置编号
                        var this_wzbh = parseInt(dxbh) +1;
                        var dxbh_val = '';
                        if(this_wzbh < 100) {
                            if(this_wzbh < 10 ) {
                                dxbh_val = '00'+this_wzbh;
                            }else {
                                dxbh_val = '0'+this_wzbh;
                            }
                        }else {
                            dxbh_val = this_wzbh;
                        }
                        $('#option_dxbh').val(dxbh_val);
                        ct_check();//冲突检测

                        $("#input_tdrq_inner").val('').attr('disabled',true).css({'background-color':'#ccc'});
                        $('#option_zpcx').val('站牌朝向');
                        $('#option_dxgg').val('灯箱规格');
                        $('#input_zp_bulidtime').val('建造日期');
                        $('#option_dxly').val('建造类型和灯箱来源');
                        $('#option_gdfs').val('供电方式和日期');
                        $('#option_tssx').val('特殊属性');

                        $('#option_dxlx').val('灯箱类型');
                        $('#option_dxks').val('灯箱款式');

                        $("#option_dxly_div a").removeClass("typeSelected");
                        $("#option_gdfs_div a").removeClass("typeSelected");
                        $("#option_tssx_div a").removeClass("typeSelected");
                        $("#ztly_inner_input").val('');
                        $("#input_tdrq_inner").val('');
                    }
                    else{
                        menuShowDialogTips(mydata.msg+",请重新查询灯箱列表进行新增操作!");
                    }
                },
                error:function (result) {
                    menuShowDialogTips("保存失败");
                }
            });

        }


    })
});

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

            var inputvalue = $(this).val();
            $("#"+divid).find("a").each(function () {
                if($(this).attr("data-val")==inputvalue)
                {
                    $(".typeSelected").removeClass("typeSelected");
                    $(this).addClass("typeSelected");
                }
            });
            //}
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

//获得鼠标点击的横纵坐标
function getPos(id) {
    var thisX = $('#'+id).position().left;
    var thisY = $('#'+id).position().top;
    return {'left_s':thisX,'top_s':thisY};
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
                $(this).parent().hide();
            });
        })
    }
}

//建造类型和灯箱来源
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
            "<input  id='input_tdrq_inner' class='Wdate' style='position: absolute;right: 20px;top:10px' type='text' placeholder='请选择日期' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\">" +
            "</div><span id='sure_gdfs' class='btn_inner' style='float: right;margin-right: 20px;margin-top: -5px'>确定</span>";
        var closehtml  ="<div class=\"titlediv\">"+title+"<div class=\"caneal close fr "+closecssname+"\"><img src='http://wxapp.whadshel.com/testimos/damei/image/close1.png' width='20'></div></div>";
        var gdfs_option = '';
        for(var i=0;i<json.length;i++){
            var j = parseInt(json.length) -1;
            if (i != j) {
                if( json[i][optionkey] == '未设置'){
                    continue;
                }
                gdfs_option +="<a style='display: block;width: 60px;text-align: center' class=\"sort cursor "+optioncssname+"\"  data-val="+json[i][optionkey]+">"+json[i][optionkey]+"</a>" +
                    "<input type='hidden' value='"+i+"'>";
            }else {
                if( json[i][optionkey] == '未设置'){
                    continue;
                }
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
        var btnshtml = "<span  class='btn_inner sure_tssx' style='margin-top: 10px'>确定</span>" +
            "<span  class='btn_inner clear_tssx' style='margin-top: 10px'>清除</span>";
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
        $('.sure_tssx').on("click",function () {
            var arr = new Array();
            $('#'+divid+' .typeSelected').each(function(){
                arr.push($(this).text());
            });
            var str = arr.join(';');
            if( str != ''){
                $('#'+divid).prev().val(str);
            }else{
                $('#'+divid).prev().val('特殊属性');
            }
            $(this).parent().hide();
        });
        $('.clear_tssx').on("click",function () {
            $(this).parent().prev().val('特殊属性');
            $(this).siblings('a').removeClass("typeSelected");
        });
    }
}

