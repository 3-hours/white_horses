var userid = "michael";
var datajson = getJsonWithUrl("getDate","");
var tao = '';
var suo = '';
var zutui = '';
$(function(){
    /*隐藏最下方三个按钮*/
    $('.confirm_rent').hide();
    /*发布期下拉框*/
    var data = '';//存储所有getDate
    var data_this = '';//存储选中的该getDate
    $.ajax({
        type:"GET",
        url:"getDate",
        dataType:"json",
        success: function(result) {
            data = result.data;
            var option_html = '';
            for (i = 0; i < data.length; i++) {
                option_html += ("<option value=" + i + ">" + data[i].fbq + "</option>");//品牌弹窗的产品行业
            }
            $("#inp_fbq").append(option_html);
        },
        error: function (result) {
            alert(result.msg);
        }
    });
    /*点击上方退租按钮的样式改变*/
    $('.btn_rent').each(function () {
        $(this).on('click',function(){
            $(this).addClass("focus_btn").siblings().removeClass("focus_btn");
        })
    })
    /*套装退租*/
    $('#tztz_btn').on('click',function(){
        $('.taozhuang_hao').each(function () {
            if($(this).text() == ''){
                $(this).next().next().html('退租');
                /*确认退租按钮显示*/
                $('#qrtz_btn').show();
            }
        })
    });
    /*空置退租*/
    $('#kztz_btn').on('click',function(){
        $('.suo_ding').each(function () {
            if($(this).text() == ''){
                $(this).next().html('退租');
                /*确认退租按钮显示*/
                $('#qrtz_btn').show();
            }
        })
    });
    /*根据发布期加载列表数据*/
    $('#inp_fbq').on('change',function () {
        var data_i = $('#inp_fbq option:selected').val();
        data_this = data[data_i];
        $('#table_before').remove();
        getzplist();
        /*刷新数据按钮显示*/
        $('#sxsj_btn').show();
    });
    /*function getzplist() {
        $.ajax({
            type:"GET",
            url:"zpqr_query",
            dataType:"json",
            data:{
                "year":data_this.year,
                "tzmc":data_this.tzmc,
                "tzfbq":data_this.tzfbq
            },
            success: function(result) {
                data = result.data;
                console.log(data);
            },
            error: function (result) {
                alert(result.msg);
            }
        });
    }*/
//达美站牌列表
    function getzplist() {
        $("body").css({width: "auto"});
        $(".listTb").html("");
        var paramsHZ = {
            "year":data_this.year,
            "tzmc":data_this.tzmc,
            "tzfbq":data_this.tzfbq
        };
        var optionHZ = {};
        optionHZ.success = function (res) {
            if (res != "" && typeof(res) != "undefined") {
                if(res.code!="0"){
                    HttpService.tips("获取列表失败！", 300, 1);
                    return;
                }
                var rows = res.data;
                var table = $('<table width="100%" border="1" id="table1"></table>');
                var tbody = $('<tbody></tbody>');
                var thead = $('<thead></thead>');
                var coltr = "";
                var colTd = "";
                coltr = $('<tr class="tops"></tr>');
                colTd = $('<th>序号</th>');
                coltr.append(colTd);
                colTd = $('<th>套装名称</th>');
                coltr.append(colTd);
                colTd = $('<th>套装发布期</th>');
                coltr.append(colTd);
                colTd = $('<th>站牌编号</th>');
                coltr.append(colTd);
                colTd = $('<th>地址</th>');
                coltr.append(colTd);
                colTd = $('<th>套装号</th>');
                coltr.append(colTd);
                colTd = $('<th>客户简称</th>');
                coltr.append(colTd);
                colTd = $('<th>确认状态</th>');
                coltr.append(colTd);
                thead.append(coltr);
                //tbody
                var rowindex =1;
                for (var item in rows) {
                    var tr = $('<tr></tr>');
                    var td = "";
                    td = $('<td >' + rowindex + '</td>' +
                        '<td >' + checkNull(rows[item].TZMC) +'</td>' +
                        '<td >' + checkNull(rows[item].TZFBQ) +'</td>' +
                        '<td class="zp_num">' + checkNull(rows[item].ZPBH) +'</td>' +
                        '<td >' + checkNull(rows[item].DZ) +'</td>' +
                        '<td class="taozhuang_hao">' + checkNull(rows[item].TZH) +'<input type="hidden" value="'+ rows[item].TC_ID+'"></td>' +
                        '<td class="suo_ding">' + checkNull(rows[item].KHJC) + '</td>' +
                        '<td class="zhuang_tai">' + checkNull(rows[item].QRZT) + '</td>'
                    );
                    tr.append(td);
                    tbody.append(tr);
                    rowindex++;
                }
                table.append(thead).append(tbody);
                $(".listTb").append(table);
                ctrl_check();
            } else {
                HttpService.tips("获取列表失败！", 300, 1);
            }
        }
        optionHZ.complete = function (res) {
            $("#table1").freezeHeader({'height': $(window).height() - 210 + "px"});
            $("body").css("overflow-y", "hidden");
            $(".tjrq").html("");
        }
        HttpService.call('zpqr_query', paramsHZ, optionHZ);
    }
//避免NULL值
    function checkNull(returnvalue) {
        if(returnvalue)
            return returnvalue;
        else return "";
    }
//手工操作退租
    function ctrl_check(){
        $('.zhuang_tai').each(function () {
            $(this).on('click',function(e){
                var s1 = $("input[name='btn_tz']:checked").val();
                if( s1 == undefined ) return;
                if(e.ctrlKey){
                    if(s1 == '清除'){
                        $(this).text('');
                        $(this).parent().css({'background-color':'#fff'});
                    }else{
                        $(this).text(s1);
                        if(s1 =='退租' ){
                            /*确认退租按钮显示*/
                            $('#qrtz_btn').show();
                        }
                        if(s1 =='临时租用' || s1 =='固定租用'){
                            /*确认租用按钮显示*/
                            $('#qrzy_btn').show();
                        }
                    }
                }
            })
        })
    }
//确认退租-按钮
    $('#qrtz_btn').on('click',function(){
        /*有套装*/
        var tui_tao_arr = [];
        /*无套装的*/
        var tui_san_arr = [];
        $('.zhuang_tai').each(function () {
            /*套装退租数组*/
           if( $(this).text() == '退租' && $(this).prev().prev().text() != ''){
               var tc_id = $(this).siblings('.taozhuang_hao').children('input').val();
               tui_tao_arr.push([$(this).siblings('.taozhuang_hao').children('input').val(),$(this).siblings('.zp_num').text()]);
               for(var i=0;i<tui_tao_arr.length;i++){
                   var tui_zplb = '';
                   if( tc_id == tui_tao_arr[i][0]){
                       if( tui_tao_arr[i][1] != $(this).siblings('.zp_num').text() ){
                           tui_zplb = tui_tao_arr[i][1] + ',' + $(this).siblings('.zp_num').text();
                           tui_tao_arr[i] = [tc_id,tui_zplb];
                           tui_tao_arr.pop();
                       }
                   }
               }
           }
            /*散点退租数组*/
           if( $(this).text() == '退租' && $(this).prev().prev().text() == '' ){
               tui_san_arr.push([$(this).siblings('.taozhuang_hao').children('input').val(),$(this).siblings('.zp_num').text()]);
           }
        })
        console.log(tui_tao_arr);
        console.log(tui_san_arr);

        if(confirm('确认对以上站牌进行退租操作？')){
            /*套装退租*/
            for(var i=0;i<tui_tao_arr.length;i++){
                var zpbhlb = tui_tao_arr[i][1];
                $.ajax({
                    url: "zpqr_tzconfirm",
                    type: "POST",
                    data:{
                        "tcid":tui_tao_arr[i][0],
                        "zpbhlb":zpbhlb,
                        "kszq":data_this.tzmc,
                        "zzzq":data_this.tzmc
                    },
                    dataType: "json",
                    success: function (result) {
                        if( zpbhlb.indexOf(',') > -1){
                            zpbhlb = tui_tao_arr[i][1].split(',').join(';');
                        }
                        //操作成功关闭窗口，刷新当前TAB
                        if (result.code == "0") {
                            $.ajax({
                                url: "tzset",
                                type: "POST",
                                data:{
                                    "userid":userid,
                                    "zplb":zpbhlb,
                                    "ksrq":data_this.ksrq,
                                    "zzrq":data_this.jsrq,
                                    "tzfbq":data_this.tzfbq
                                },
                                dataType: "json",
                                success: function (result) {
                                    //操作成功关闭窗口，刷新当前TAB
                                    if (result.code == "0") {
                                        menuShowDialogTips("套装退租设定成功");
                                        var shua = tui_tao_arr.length;
                                        if(i == shua){
                                            $('#sxsj_btn').click();
                                        }
                                    }
                                    else
                                    {
                                        //操作失败则进行提示。
                                        menuShowDialogTips(result.msg);
                                        $("#zzzqlb").text("");
                                        $("#zzzzrqlb").val("");
                                    }
                                },
                                error:function (result) {
                                    menuShowDialogTips("退租设定失败");
                                }
                            });
                        }
                        else
                        {
                            //操作失败则进行提示。
                            menuShowDialogTips(result.msg);
                            $("#zzzqlb").text("");
                            $("#zzzzrqlb").val("");
                        }
                    },
                    error:function (result) {
                        menuShowDialogTips("止租设定失败");
                    }
                });
            }
            /*散点退租*/
            for(var i=0;i<tui_san_arr.length;i++){
                $.ajax({
                    url: "tzset",
                    type: "POST",
                    data:{
                        "userid":userid,
                        "zplb":tui_san_arr[i][1],
                        "ksrq":data_this.ksrq,
                        "zzrq":data_this.jsrq,
                        "tzfbq":data_this.tzfbq
                    },
                    dataType: "json",
                    success: function (result) {
                        //操作成功关闭窗口，刷新当前TAB
                        if (result.code == "0") {
                            menuShowDialogTips("散点退租设定成功");
                            var shua = tui_san_arr.length;
                            if(i == shua){
                                $('#sxsj_btn').click();
                            }
                        }
                        else
                        {
                            //操作失败则进行提示。
                            menuShowDialogTips(result.msg);
                            $("#zzzqlb").text("");
                            $("#zzzzrqlb").val("");
                        }
                    },
                    error:function (result) {
                        menuShowDialogTips("退租设定失败");
                    }
                });
            }
        }
    });
//刷新数据-按钮
    $('#sxsj_btn').on('click',function(){
        $.ajax({
            url: "zpqr_refresh",
            type: "POST",
            data:{
                "userid":userid,
                "tzmc":data_this.tzmc,
                "year":data_this.year,
                "tzfbq":data_this.tzfbq,
                "ksrq":data_this.ksrq,
                "jsrq":data_this.jsrq
            },
            dataType: "json",
            success: function (result) {
                //操作成功关闭窗口，刷新当前TAB
                if (result.code == "0") {

                    getzplist();
                }
                else
                {
                    //操作失败则进行提示。
                    menuShowDialogTips(result.msg);

                }
            },
            error:function (result) {
                menuShowDialogTips("刷新数据失败");
            }
        });
    });
//确认租用-按钮
    $('#qrzy_btn').on('click',function(){
        var zu_arr = [];
        $('.zhuang_tai').each(function () {
            if( $(this).text() == '临时租用' || $(this).text() == '固定租用'){
                zu_arr.push([$(this).siblings('.zp_num').text(),$(this).text()]);
            }
        })
        console.log(zu_arr);
        if(confirm('确认对以上数据进行租用操作？')){
            for(var i =0;i<zu_arr.length;i++){
                $.ajax({
                    url: "zycheck",
                    type: "POST",
                    data:{
                        "zplb":zu_arr[i][0],
                        "ksrq":data_this.ksrq,
                        "zzrq":data_this.jsrq
                    },
                    dataType: "json",
                    success: function (result) {
                        var canSetZy = true;//是否能设置租用
                        var zpdata = result.data;
                        var newhtml ="";
                        for(var zpitem in zpdata)
                        {
                            var zpclass = zpdata[zpitem].zpclass;
                            var zyclass = zpdata[zpitem].zyclass;
                            if(zpclass!="" || zyclass!="")
                            {
                                $('.zp_num').each(function () {
                                  if( $(this).text() == zpdata[zpitem].zpbh){
                                      $(this).parent().css({'background-color':'#bdebee'});
                                      canSetZy = false;
                                  }
                                })
                            }
                        }
                        if(canSetZy){
                            //租用设定//循环调用接口
                            for(var i=0;i<zu_arr.length;i++){
                                $.ajax({
                                    url: "zyset",
                                    type: "POST",
                                    data:{
                                        "userid":userid,
                                        "zplb":zu_arr[i][0],
                                        "ksrq":data_this.ksrq,
                                        "zzrq":data_this.jsrq,
                                        "tzfbq":data_this.tzfbq,
                                        "zylx":zu_arr[i][1],
                                    },
                                    dataType: "json",
                                    success: function (result) {
                                        //操作成功关闭窗口
                                        if (result.code == "0") {
                                            menuShowDialogTips("租用设定成功");
                                            var shua = zu_arr.length;
                                            if(i == shua){
                                                $('#sxsj_btn').click();
                                            }
                                        }
                                        else
                                        {
                                            //操作失败则进行提示。
                                            menuShowDialogTips(result.msg);
                                        }
                                    },
                                    error:function (result) {
                                        menuShowDialogTips("租用设定失败");
                                    }
                                });
                            }
                        }else {
                            menuShowDialogTips("浅蓝色站牌已经被租用了,不能再租了");
                        }
                    },
                    error:function (result) {
                        menuShowDialogTips("租用操作失败");
                    }
                });
            }
        }
    });
})
