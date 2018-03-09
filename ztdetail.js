/**
 * Created by huang_hui on 2017-12-20.
 */
var userid  = art.dialog.data("post_userid");
var csm = art.dialog.data("post_csm");
var ztbh =art.dialog.data("post_ztbh");
var hasqyfzmc = art.dialog.data("post_hasqyfzmc");
var ztobj = art.dialog.data("post_ztobj");
var isAudit = art.dialog.data("post_isAuidt");
$(function () {
    //console.log(ztobj);
    buildHtml(ztobj);
    if(isAudit)
    {
        $(".buttons").show();
        $("#pass").click(function () {
            var tgzt = $(this).attr("tgzt");
            zpsh("通过");

        });

        //资料中心审核否决
        $("#reject").click(function () {
            var tgzt = $(this).attr("tgzt");
            zpsh("不通过");
        });
    }
    else $(".buttons").hide();


});

//2017-12-24 by huanghui
//ztobj结构
/*
 "{"zt_id":"29767","csm":"北京","ztbh":"京B0198","ztjb":"AAA","ztlx_id":"巴士站","zm":"东四十条桥东站","lm":"工体北路","xzqy":"东城区","fjbzw":"亚洲大酒店对面",
 "zdfw":"路北","kfzt_code":"完成","ztscrq":"","ztsclx":"","xgzt":"通过","lng":"116.439","lat":"39.9338","zt_pk_fgs":"","zp_pk_fgs":"","zt_id_fgs":"","csm_fgs":"","ztbh_fgs":"","ztjb_fgs":"",
 "ztlx_id_fgs":"","zm_fgs":"","lm_fgs":"","xzqy_fgs":"","fjbzw_fgs":"","zdfw_fgs":"","kfzt_code_fgs":"","ztscrq_fgs":"","ztsclx_fgs":"","xgzt_fgs":"","xgsj_fgs":"","imark":"iMARK_02441(0.71)",
 "zpkeys":["105999_-1","106002_-1","106003_-1","261143_-1"],
 "zps":{"105999_-1":{"xgsj":"2017-12-19 20:42:06.617","zp_id":105999,"zpbh":"京B0198-001","dxly":"白马","dxqs":"白马","dxjzfs":"自建","jtrq":"1999-06-23","ggh":"大牌","dxcx":"","tdrq":"2000-05-30","
 tdzt":"Y","dxtdfs":"","dxxszt":"A套装","dxzmdzbq":"E00401007FD82CDE","dxbmdzbq":"E00401007FD801DE","zyzt":"2","zpsclx":"","zpscrq":"","kflx":"自建","zpzt":"常规","zpztbdsj":"","jlrq":"2017-12-17",
 "xgrq":"2017-12-17","yszt":"Y","yssj":"2014-05-12","ysr":"牛彦军","wzph":"001","dmdx":"","ksmc":"A","kspk":"11","qyfzmc":"C片区","dtbz":"已标注","ksxsrq":"","zp_id_fgs":"","zpbh_fgs":"",
 "dxly_fgs":"","dxqs_fgs":"","dxjzfs_fgs":"","jtrq_fgs":"","ggh_fgs":"","dxcx_fgs":"","tdrq_fgs":"","tdzt_fgs":"","dxtdfs_fgs":"","dxxszt_fgs":"","dxzmdzbq_fgs":"","dxbmdzbq_fgs":"","zyzt_fgs":"",
 "zpsclx_fgs":"","zpscrq_fgs":"","kflx_fgs":"","zpzt_fgs":"","zpztbdsj_fgs":"","jlrq_fgs":"","xgrq_fgs":"","yszt_fgs":"","yssj_fgs":"","ysr_fgs":"","wzph_fgs":"","dmdx_fgs":"","ksmc_fgs":"",
 "kspk_fgs":"","qyfzmc_fgs":"","dtbz_fgs":"","ksxsrq_fgs":"","dzmc":"","flmc":"","xh":4},
 "106002_-1":{"xgsj":"2017-12-19 20:42:06.617","zp_id":106002,"zpbh":"京B0198-002","dxly":"白马","dxqs":"白马","dxjzfs":"自建","jtrq":"1999-06-23","ggh":"大牌","dxcx":"",
 "tdrq":"2000-04-06","tdzt":"Y","dxtdfs":"","dxxszt":"B套装","dxzmdzbq":"E0040100206DE1F9","dxbmdzbq":"E00401007FD86931","zyzt":"2","zpsclx":"","zpscrq":"","kflx":"自建",
 "zpzt":"常规","zpztbdsj":"","jlrq":"2017-12-17","xgrq":"2017-12-17","yszt":"Y","yssj":"2014-05-12","ysr":"牛彦军","wzph":"002","dmdx":"","ksmc":"A","kspk":"11","qyfzmc":"C片区",
 "dtbz":"已标注","ksxsrq":"","zp_id_fgs":"","zpbh_fgs":"","dxly_fgs":"","dxqs_fgs":"","dxjzfs_fgs":"","jtrq_fgs":"","ggh_fgs":"","dxcx_fgs":"","tdrq_fgs":"","tdzt_fgs":"","dxtdfs_fgs":"",
 "dxxszt_fgs":"","dxzmdzbq_fgs":"","dxbmdzbq_fgs":"","zyzt_fgs":"","zpsclx_fgs":"","zpscrq_fgs":"","kflx_fgs":"","zpzt_fgs":"","zpztbdsj_fgs":"","jlrq_fgs":"","xgrq_fgs":"","yszt_fgs":"",
 "yssj_fgs":"","ysr_fgs":"","wzph_fgs":"","dmdx_fgs":"","ksmc_fgs":"","kspk_fgs":"","qyfzmc_fgs":"","dtbz_fgs":"","ksxsrq_fgs":"","dzmc":"","flmc":"","xh":5},
 "106003_-1":{"xgsj":"2017-12-19 20:42:06.617","zp_id":106003,"zpbh":"京B0198-003","dxly":"白马","dxqs":"白马","dxjzfs":"自建","jtrq":"1999-06-23","ggh":"大牌","dxcx":"","tdrq":"2000-05-30",
 "tdzt":"Y","dxtdfs":"","dxxszt":"B套装","dxzmdzbq":"E00401007FD7F686","dxbmdzbq":"E00401007FD81916","zyzt":"2","zpsclx":"","zpscrq":"","kflx":"自建","zpzt":"常规","zpztbdsj":"","jlrq":"2017-12-17",
 "xgrq":"2017-12-17","yszt":"Y","yssj":"2014-05-12","ysr":"牛彦军","wzph":"003","dmdx":"","ksmc":"A","kspk":"11","qyfzmc":"C片区","dtbz":"已标注","ksxsrq":"","zp_id_fgs":"","zpbh_fgs":"",
 "dxly_fgs":"","dxqs_fgs":"","dxjzfs_fgs":"","jtrq_fgs":"","ggh_fgs":"","dxcx_fgs":"","tdrq_fgs":"","tdzt_fgs":"","dxtdfs_fgs":"","dxxszt_fgs":"","dxzmdzbq_fgs":"","dxbmdzbq_fgs":"",
 "zyzt_fgs":"","zpsclx_fgs":"","zpscrq_fgs":"","kflx_fgs":"","zpzt_fgs":"","zpztbdsj_fgs":"","jlrq_fgs":"","xgrq_fgs":"","yszt_fgs":"","yssj_fgs":"","ysr_fgs":"","wzph_fgs":"","dmdx_fgs":"",
 "ksmc_fgs":"","kspk_fgs":"","qyfzmc_fgs":"","dtbz_fgs":"","ksxsrq_fgs":"","dzmc":"","flmc":"","xh":6},"261143_-1":{"xgsj":"2017-12-19 20:42:06.617","zp_id":261143,"zpbh":"京B0198-012","dxly":"白马",
 "dxqs":"白马","dxjzfs":"自建","jtrq":"2017-12-01","ggh":"大牌","dxcx":"","tdrq":"2017-12-20","tdzt":"Y","dxtdfs":"","dxxszt":"散点","dxzmdzbq":"","dxbmdzbq":"","zyzt":"3","zpsclx":"","zpscrq":"",
 "kflx":"自建","zpzt":"常规","zpztbdsj":"","jlrq":"2017-12-22","xgrq":"2017-12-22","yszt":"N","yssj":"","ysr":"","wzph":"012","dmdx":"","ksmc":"06I","kspk":"2","qyfzmc":"C片区","dtbz":"已标注",
 "ksxsrq":"","zp_id_fgs":"","zpbh_fgs":"","dxly_fgs":"","dxqs_fgs":"","dxjzfs_fgs":"","jtrq_fgs":"","ggh_fgs":"","dxcx_fgs":"","tdrq_fgs":"","tdzt_fgs":"","dxtdfs_fgs":"","dxxszt_fgs":"",
 "dxzmdzbq_fgs":"","dxbmdzbq_fgs":"","zyzt_fgs":"","zpsclx_fgs":"","zpscrq_fgs":"","kflx_fgs":"","zpzt_fgs":"","zpztbdsj_fgs":"","jlrq_fgs":"","xgrq_fgs":"","yszt_fgs":"","yssj_fgs":"","ysr_fgs":"",
 "wzph_fgs":"","dmdx_fgs":"","ksmc_fgs":"","kspk_fgs":"","qyfzmc_fgs":"","dtbz_fgs":"","ksxsrq_fgs":"","dzmc":"","flmc":"","xh":7}}}
 */
var oldclass="grayContent";
var newclass="redContent";
var hiddenclass ="hiddenContent";
function buildHtml(ztobj) {
    var zplist = ztobj.zpkeys;
    var zpobjs = ztobj.zps;
    $("#table-box body").empty();
    var tablehtml ="";

    var tdFontClass = "";
    var AlltdFontClass="";
    var zplength = zplist.length;
    for(var z=0;z<zplength;z++) {
        var zpobj = zpobjs[zplist[z]];
        //console.log(zpobj);
        tablehtml += "<tr valign='top'>";

        var tdhtml ="";

        if(z==0) {
            if(ztobj.ztscrq_fgs!=null && ztobj.ztscrq_fgs!=""){
                AlltdFontClass ="deleteContent";
            }
            if(ztobj.zt_id=="")
            {//新建站亭时，所有颜色都红色
                AlltdFontClass =" redContent";
            }
            tablehtml += "<td rowspan='" + zplength + "' class='"+AlltdFontClass+"'>";
            tablehtml += zdbhTdHtml(ztobj);
            tablehtml += "</td>";

            tablehtml += "<td rowspan='" +zplength + "' class='"+AlltdFontClass+"'>";
            tablehtml += zddzTdHtml(ztobj);
            tablehtml += "</td>";
        }
        //当站亭是非删除状态时才去判断站牌的删除状态
        if(AlltdFontClass=="") {
            if ((zpobj.zpscrq != null && zpobj.zpscrq != "") || (zpobj.zpscrq_fgs != null && zpobj.zpscrq_fgs != "") ) {//if($ztItem["shzt"]=="删除")
                 tdFontClass = "deleteContent";
            }
            else  tdFontClass = "";
        }
        else{
            tdFontClass = AlltdFontClass;//站亭为删除状态，不需要再判断站牌了，所有的ZP全部用横线
        }
        if(zpobj.zp_id=="")
        {//新增灯箱
            tdFontClass =" redContent";
        }
        //位置序号
        var wzxhhtml =normalTdHtml(zpobj,["wzph","dxcx"],["",""]);
        tablehtml +="<td class='"+tdFontClass+"'>"+wzxhhtml+"</td>";//位置序号

        //灯箱编号
        var dxtrhtml = normalTdHtml(zpobj,["zpbh","ggh"],["",""])
        tablehtml +="<td  class='"+tdFontClass+"'>"+dxtrhtml+"</td>";//灯箱编号

        //灯箱建造方式
        var jzfstdhtml =dxjzfsTdHtml(zpobj);
        tablehtml +="<td  class='"+tdFontClass+"'>"+jzfstdhtml+"</td>";//灯箱来源

        //常规属性
        var sxtdhtml = normalTdHtml(zpobj,["ksmc","dxlx"],["未定义款式",""]);
        tablehtml +="<td  class='"+tdFontClass+"'>"+sxtdhtml+"</td>";//常规属性

        //特殊属性
        var tssxtdhtml =  normalTdHtml(zpobj,["dmdx","zpzt"],["",""]);
        tssxtdhtml = tssxtdhtml.replace("常规","");//特殊属性中不显示常规字眼，常规则为空。
        tablehtml +="<td  class='"+tdFontClass+"'>"+tssxtdhtml+"</td>";//特殊属性
        //通电
        var tdtdhtml = normalTdHtml(zpobj,["dxtdfs","tdrq"],["未设置通电方式",""]);
        tablehtml +="<td  class='"+tdFontClass+"'>"+tdtdhtml+"</td>";//通电
        //建牌日期
        tablehtml +="<td  class='"+tdFontClass+"'>"+zpobj.jtrq+"<br/>"+zpobj.ksxsrq+"</td>";//建牌日期
        //拆除
        var cctdhtml = normalTdHtml(zpobj,["zpscrq","zpsclx"],["",""]);
        tablehtml +="<td   class='"+tdFontClass+"'>"+cctdhtml+"</td>";//拆除日期
        tablehtml +="</tr>";
    }

    $("#table-box tbody").append(tablehtml);
}
//站点编号
function  zdbhTdHtml(ztobj) {
    var tablehtml ="";
    //站点编号
    if(ztobj.zm_fgs!="" && ztobj.zm_fgs != ztobj.zm)
    {
        tablehtml += "<p >" +ztobj.ztbh + "</p>";
        tablehtml += "<p class='redContent'>" +checkNull(ztobj.zm_fgs) + "</p>";
        if(ztobj.dtbz=="已标注地图") {
            tablehtml += "<p class='redContent'>GPS:</p>";
            tablehtml += "<p class='redContent'>"+ztobj.lng+"</p>";
            tablehtml += "<p class='redContent'>"+ztobj.lat+"</p>";

        }
        if(ztobj.imark!=null && ztobj.imark!="")
        {
            tablehtml += "<p class='redContent'>信标:</p>";
            tablehtml += "<p class='redContent'>"+ztobj.imark+"</p>";
        }
        tablehtml += "<br/>";
        tablehtml += "<p class='grayContent'>" +ztobj.ztbh + "</p>";
        tablehtml += "<p class='grayContent'>" +checkNull(ztobj.zm) + "</p>";
        if(ztobj.dtbz=="已标注地图") {
            tablehtml += "<p class='grayContent'>GPS:</p>";
            tablehtml += "<p class='grayContent'>"+ztobj.lng+"</p>";
            tablehtml += "<p class='grayContent'>"+ztobj.lat+"</p>";
        }
        if(ztobj.imark!=null && ztobj.imark!="")
        {
            tablehtml += "<p class='grayContent'>信标:</p>";
            tablehtml += "<p class='grayContent'>"+ztobj.imark+"</p>";
        }
    }
    else{
        tablehtml += "<p>" +ztobj.ztbh + "</p>";
        tablehtml += "<p> " +checkNull(ztobj.zm) + "</p>";
        if(ztobj.dtbz=="已标注地图") {//站亭的地图标注没有值
            tablehtml += "<p>GPS:</p>";
            tablehtml += "<p>"+ztobj.lng+"</p>";
            tablehtml += "<p>"+ztobj.lat+"</p>";

        }
        if(ztobj.imark!=null && ztobj.imark!="")
        {
            tablehtml += "<p>信标:</p>";
            tablehtml += "<p>"+ztobj.imark+"</p>";
        }
    }
    return tablehtml;
}
//站点地址
function zddzTdHtml(ztobj) {
    var tablehtml ="";
    if(ztobj.xzqy_fgs==""  &&  ztobj.lm_fgs=="" && ztobj.zdfw_fgs==""  &&  ztobj.fjbzw_fgs=="")
    {
        tablehtml += "<p>" +ztobj.xzqy + "</p>";
        tablehtml += "<p> " +ztobj.lm + "</p>";
        tablehtml += "<p> " +ztobj.zdfw + "</p>";
        tablehtml += "<p> " +ztobj.fjbzw + "</p>";
        tablehtml += "<p> " +ztobj.ztjb + "</p>";
        tablehtml += "<p >" +checkNullWithOhter(ztobj.jtrq,"建造日期： ") + "</p>";
    }
    else  if(ztobj.xzqy != ztobj.xzqy_fgs || ztobj.lm != ztobj.lm_fgs || ztobj.zdfw != ztobj.zdfw_fgs ||ztobj.fjbzw != ztobj.fjbzw_fgs ) {
        var newhtml = "";
        var oldhtml = "";
        if (ztobj.xzqy != ztobj.xzqy_fgs) {
            newhtml += "<p class='" + newclass + "'>" + checkNull(ztobj.xzqy_fgs) + "</p>";//行政区域
            oldhtml += "<p class='" + oldclass + "'>" + checkNull(ztobj.xzqy) + "</p>";//行政区域
        }
        else {
            newhtml += "<p>" + checkNull(ztobj.xzqy) + "</p>";//行政区域
            oldhtml += "<p class='" + oldclass + "'>" + checkNull(ztobj.xzqy) + "</p>";//行政区域
        }

        if(ztobj.lm != ztobj.lm_fgs)
        {
            newhtml += "<p class='"+newclass+"'>" +checkNull(ztobj.lm_fgs) + "</p>";//路名
            oldhtml += "<p class='"+oldclass+"'>" +checkNull(ztobj.lm) + "</p>";//路名
        }else {
            newhtml += "<p>" + checkNull(ztobj.lm) + "</p>";//路名
            oldhtml += "<p class='" + oldclass + "'>" + checkNull(ztobj.lm) + "</p>";//路名
        }
        if(ztobj.zdfw != ztobj.zdfw_fgs)
        {
            newhtml += "<p class='"+newclass+"'>" +checkNull(ztobj.zdfw_fgs) + "</p>";//站点方位
            oldhtml += "<p class='"+oldclass+"'>" +checkNull(ztobj.zdfw) + "</p>";//站点方位
        }else {
            newhtml += "<p>" + checkNull(ztobj.zdfw) + "</p>";//站点方位
            oldhtml += "<p class='" + oldclass + "'>" +checkNull( ztobj.zdfw) + "</p>";//站点方位
        }
        if(ztobj.fjbzw != ztobj.fjbzw_fgs)
        {
            newhtml += "<p class='"+newclass+"'>" +checkNull(ztobj.fjbzw_fgs) + "</p>";//附近标志物
            oldhtml += "<p class='"+oldclass+"'>" +checkNull(ztobj.fjbzw) + "</p>";//附近标志物

        }else
        {
            newhtml += "<p>" +checkNull(ztobj.fjbzw) + "</p>";//附近标志物
            oldhtml += "<p class='" + oldclass + "'>" +checkNull(ztobj.fjbzw) + "</p>";//附近标志物
        }
        tablehtml += newhtml;
        tablehtml += "<p> " +ztobj.ztjb + "</p>";
        tablehtml += "<p>" +checkNullWithOhter( ztobj.jtrq,"建造日期：") + "</p>";
        tablehtml += "<br/>";
        tablehtml += oldhtml;
        tablehtml += "<p class='"+oldclass+"'> " +ztobj.ztjb + "</p>";
        tablehtml += "<p class='"+oldclass+"'>" +checkNullWithOhter( ztobj.jtrq,"建造日期：") + "</p>";
    }
    else
    {
        tablehtml += "<p>" +ztobj.xzqy + "</p>";
        tablehtml += "<p> " +ztobj.lm + "</p>";
        tablehtml += "<p> " +ztobj.zdfw + "</p>";
        tablehtml += "<p> " +ztobj.fjbzw + "</p>";
        tablehtml += "<p> " +ztobj.ztjb + "</p>";
        tablehtml += "<p > " +checkNullWithOhter(ztobj.jtrq,"建造日期： ") + "</p>";
    }
    return tablehtml;
}

//通用TD的拼接，只是同单元格两个值，且判断两个值和fgs的对应值是否一致，
//没有其他特殊属性的赋值
//分两段显示
// 上面显示为黑色（未修改）/红色（有修改）
// 下面显示为灰色-- 有修改时候才显示，否则会导致没有修改也显示灰色的旧数据在下面
function  normalTdHtml(zpobj,oldkey,defaultvalue) {
   var tablehtml ="";
   var oldhtml ="";
   var key1 = oldkey[0];
   var key2 = oldkey[1];
   var newkey1 = key1+"_fgs";
   var newkey2 = key2+"_fgs";
   if(checkValue(zpobj[newkey1])&& checkValue(zpobj[newkey2]))
   {//没有做过任何修改
       tablehtml +="<p>" +checkNullDefault(zpobj[key1],defaultvalue[0]) + "</p>";
       tablehtml +="<p>" +checkNullDefault(zpobj[key2],defaultvalue[1]) + "</p>";
   }
   else{
       //还有一种情况是完全新建的情况 key 和 key_fgs 的数据是一致的 那么同样不显示灰色信息
       if(zpobj[newkey1] == zpobj[key1] && zpobj[newkey2] == zpobj[key2])
       {
           tablehtml += "<p>" + checkNullDefault(zpobj[newkey1],defaultvalue[0]) + "</p>";
           tablehtml += "<p>" + checkNullDefault(zpobj[newkey2],defaultvalue[1]) + "</p>";
       }
       else {
           if (zpobj[newkey1] != zpobj[key1]) {
               tablehtml += "<p class='" + newclass + "'>" + checkNullDefault(zpobj[newkey1],defaultvalue[0]) + "</p>";
           }
           else {
               tablehtml += "<p>" + checkNullDefault(zpobj[key1],defaultvalue[0])+ "</p>";
           }
           if (zpobj[newkey2] != zpobj[key2]) {
               tablehtml += "<p class='" + newclass + "'>" + checkNullDefault(zpobj[newkey2],defaultvalue[1]) + "</p>";
           }
           else {
               tablehtml += "<p>" + checkNullDefault(zpobj[key2],defaultvalue[1])+ "</p>";
           }
           tablehtml += "<BR/>";
           tablehtml += "<p class='" + oldclass + "'>" + checkNullDefault(zpobj[key1],defaultvalue[0]) + "</p>";
           tablehtml += "<p class='" + oldclass + "'>" + checkNullDefault(zpobj[key2],defaultvalue[1]) + "</p>";
       }
   }
   return tablehtml;
}

function  dxjzfsTdHtml(zpobj) {
    var tablehtml ="";
    if(checkValue(zpobj.dxjzfs_fgs)) {
        //灯箱建造方式_FGS值为空
        if(zpobj.dxjzfs!="自建") {
            tablehtml += "<p>" + checkNull(zpobj.dxjzfs) + "</p>";
            tablehtml += "<br/><p>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
        }
        else  tablehtml += "<p>" + checkNull(zpobj.dxjzfs) + "</p>";
    }
    else
    {
        if(zpobj.dxjzfs_fgs!=zpobj.dxjzfs)
        {//分公司建造方式不同于正式建造方式时
            if(zpobj.dxjzfs_fgs!="自建") {
                //新数据行
                tablehtml += "<p  class='" + newclass + "'>" + checkNull(zpobj.dxjzfs_fgs) + "</p>";
                if (zpobj.dxly_fgs != zpobj.dxly || zpobj.dxqs != zpobj.dxqs_fgs) {
                    tablehtml += "<p class='" + newclass + "'>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
                }
                else {
                    tablehtml += "<p>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
                 }
                 //旧数据有可能是自建
                if(zpobj.dxjzfs!="自建")
                {
                    tablehtml +="<br/>";
                    tablehtml += "<p class='" + oldclass + "'>" + checkNull(zpobj.dxjzfs) + "</p>";
                    tablehtml += "<p class='" + oldclass + "'>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/")  + "</p>";
                }
                else
                {
                    tablehtml +="<br/>";
                    tablehtml += "<p class='" + oldclass + "'>" + checkNull(zpobj.dxjzfs) + "</p>";
                }
            }
            else{
                tablehtml += "<p class='" + newclass + "'>" + checkNull(zpobj.dxjzfs_fgs) + "</p>";
                tablehtml +="<br/>";
                tablehtml += "<p class='" + oldclass + "'>" + checkNull(zpobj.dxjzfs) + "</p>";
                tablehtml += "<p class='" + oldclass + "'>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/")  + "</p>";
            }

        }
        else {
            if(zpobj.dxjzfs!="自建") {
                //建造方式一致时，有可能修改灯箱来源和灯箱权属
                tablehtml += "<p>" + checkNull(zpobj.dxjzfs) + "</p>";
                if (zpobj.dxly_fgs != zpobj.dxly || zpobj.dxqs != zpobj.dxqs_fgs) {
                    tablehtml += "<p class='" + newclass + "'>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
                    tablehtml += "<br/><p class='" + oldclass + "'>" + checkNull(zpobj.dxjzfs) + "</p>";
                    tablehtml += "<p class='" + oldclass + "'>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
                }
                else
                    tablehtml += "<p>" + checkNullDefault(zpobj.dxly, "无来源") + checkNullWithOhter(zpobj.dxqs, "/") + "</p>";
            }
            else {
                //都为自建时，不需要管其他的
                tablehtml += "<p>" + checkNull(zpobj.dxjzfs) + "</p>";
            }
        }
    }
    return tablehtml;
}


//
// function oldhtml() {
//     $.ajax({
//         url: window.httplink+"/" +"ztquery",
//         type: "POST",
//         data:{
//             "userid":userid,
//             "csm":csm,
//             "ztbh":ztbh
//         },
//         async: false,
//         dataType: "html",
//         success: function (pagedata) {
//             var result = eval('('+pagedata+')');
//             if(result.code=="0") {
//                 var tablejson = result.data;
//                 if(tablejson) {
//                     $("#table-box body").empty();
//                     var tablehtml ="";
//                     var jslength=0;
//                     for(var trjson in tablejson){
//                         jslength++;
//                     }
//                     var index = 0;
//                     var tdFontClass = "";
//                     var AlltdFontClass="";
//                     for(var trjson in tablejson){
//
//                         var oldclass="grayContent";
//                         var newclass="redContent";
//                         var hiddenclass ="hiddenContent";
//                         var tdhtml ="";
//                         tablehtml += "<tr valign='top'>";
//                         if(index==0) {
//                             if(tablejson[trjson].ztscrq_fgs!=null && tablejson[trjson].ztscrq_fgs!=""){//if($ztItem["shzt"]=="删除")
//                                 AlltdFontClass ="deleteContent";
//                             }
//                             tablehtml += "<td rowspan='" + jslength + "' class='"+AlltdFontClass+"'>";
//                             //站点编号
//                             if(tablejson[trjson].zm != tablejson[trjson].zm_fgs)
//                             {
//                                 tablehtml += "<p >" +tablejson[trjson].ztbh + "</p>";
//                                 tablehtml += "<p class='redContent'>" +checkNull(tablejson[trjson].zm_fgs) + "</p>";
//                                 if(tablejson[trjson].dtbz=="已标注") {
//                                     tablehtml += "<p class='redContent'>GPS:</p>";
//                                     tablehtml += "<p class='redContent'>"+tablejson[trjson].lng+"</p>";
//                                     tablehtml += "<p class='redContent'>"+tablejson[trjson].lat+"</p>";
//
//                                 }
//                                 if(tablejson[trjson].imark!=null && tablejson[trjson].imark!="")
//                                 {
//                                     tablehtml += "<p class='redContent'>信标:</p>";
//                                     tablehtml += "<p class='redContent'>"+tablejson[trjson].imark+"</p>";
//                                 }
//                                 tablehtml += "<br/>";
//                                 tablehtml += "<p class='grayContent'>" +tablejson[trjson].ztbh + "</p>";
//                                 tablehtml += "<p class='grayContent'>" +checkNull(tablejson[trjson].zm) + "</p>";
//                                 if(tablejson[trjson].dtbz=="已标注") {
//                                     tablehtml += "<p class='grayContent'>GPS:</p>";
//                                     tablehtml += "<p class='grayContent'>"+tablejson[trjson].lng+"</p>";
//                                     tablehtml += "<p class='grayContent'>"+tablejson[trjson].lat+"</p>";
//                                 }
//                                 if(tablejson[trjson].imark!=null && tablejson[trjson].imark!="")
//                                 {
//                                     tablehtml += "<p class='grayContent'>信标:</p>";
//                                     tablehtml += "<p class='grayContent'>"+tablejson[trjson].imark+"</p>";
//                                 }
//                             }
//                             else{
//                                 tablehtml += "<p>" +tablejson[trjson].ztbh + "</p>";
//                                 tablehtml += "<p> " +checkNull(tablejson[trjson].zm) + "</p>";
//                                 tablehtml += "<p>" +checkNull(tablejson[trjson].zm) + "</p>";
//                                 if(tablejson[trjson].dtbz=="已标注") {
//                                     tablehtml += "<p>GPS:</p>";
//                                     tablehtml += "<p>"+tablejson[trjson].lng+"</p>";
//                                     tablehtml += "<p>"+tablejson[trjson].lat+"</p>";
//
//                                 }
//                                 if(tablejson[trjson].imark!=null && tablejson[trjson].imark!="")
//                                 {
//                                     tablehtml += "<p>信标:</p>";
//                                     tablehtml += "<p>"+tablejson[trjson].imark+"</p>";
//                                 }
//                             }
//
//                             tablehtml += "</td>";
//
//                             tablehtml += "<td rowspan='" +jslength + "' class='"+AlltdFontClass+"'>";
//                             if(tablejson[trjson].xzqy != tablejson[trjson].xzqy_fgs || tablejson[trjson].lm != tablejson[trjson].lm_fgs ||tablejson[trjson].zdfw != tablejson[trjson].zdfw_fgs ||tablejson[trjson].fjbzw != tablejson[trjson].fjbzw_fgs ) {
//                                 var newhtml = "";
//                                 var oldhtml = "";
//                                 if (tablejson[trjson].xzqy != tablejson[trjson].xzqy_fgs) {
//                                     newhtml += "<p class='" + newclass + "'>" + checkNull(tablejson[trjson].xzqy_fgs) + "</p>";//行政区域
//                                     oldhtml += "<p class='" + oldclass + "'>" + checkNull(tablejson[trjson].xzqy) + "</p>";//行政区域
//                                 }
//                                 else {
//                                     newhtml += "<p>" + checkNull(tablejson[trjson].xzqy) + "</p>";//行政区域
//                                     oldhtml += "<p class='" + oldclass + "'>" + checkNull(tablejson[trjson].xzqy) + "</p>";//行政区域
//                                 }
//
//                                 if(tablejson[trjson].lm != tablejson[trjson].lm_fgs)
//                                 {
//                                     newhtml += "<p class='"+newclass+"'>" +checkNull(tablejson[trjson].lm_fgs) + "</p>";//路名
//                                     oldhtml += "<p class='"+oldclass+"'>" +checkNull(tablejson[trjson].lm) + "</p>";//路名
//                                 }else {
//                                     newhtml += "<p>" + checkNull(tablejson[trjson].lm) + "</p>";//路名
//                                     oldhtml += "<p class='" + oldclass + "'>" + checkNull(tablejson[trjson].lm) + "</p>";//路名
//                                 }
//                                 if(tablejson[trjson].zdfw != tablejson[trjson].zdfw_fgs)
//                                 {
//                                     newhtml += "<p class='"+newclass+"'>" +checkNull(tablejson[trjson].zdfw_fgs) + "</p>";//站点方位
//                                     oldhtml += "<p class='"+oldclass+"'>" +checkNull(tablejson[trjson].zdfw) + "</p>";//站点方位
//                                 }else {
//                                     newhtml += "<p>" + checkNull(tablejson[trjson].zdfw) + "</p>";//站点方位
//                                     oldhtml += "<p class='" + oldclass + "'>" +checkNull( tablejson[trjson].zdfw) + "</p>";//站点方位
//                                 }
//                                 if(tablejson[trjson].fjbzw != tablejson[trjson].fjbzw_fgs)
//                                 {
//                                     newhtml += "<p class='"+newclass+"'>" +checkNull(tablejson[trjson].fjbzw_fgs) + "</p>";//附近标志物
//                                     oldhtml += "<p class='"+oldclass+"'>" +checkNull(tablejson[trjson].fjbzw) + "</p>";//附近标志物
//
//                                 }else
//                                 {
//                                     newhtml += "<p>" +checkNull(tablejson[trjson].fjbzw) + "</p>";//附近标志物
//                                     oldhtml += "<p class='" + oldclass + "'>" +checkNull(tablejson[trjson].fjbzw) + "</p>";//附近标志物
//                                 }
//
//
//
//                                 tablehtml += newhtml;
//                                 tablehtml += "<p> " +ztobj.ztjb + "</p>";
//                                 tablehtml += "<p>建造日期： " +ztobj.jtrq + "</p>";
//                                 tablehtml += "<br/>";
//                                 tablehtml += oldhtml;
//                                 tablehtml += "<p class='"+oldclass+"'> " +ztobj.ztjb + "</p>";
//                                 tablehtml += "<p class='"+oldclass+"'>建造日期： " +ztobj.jtrq + "</p>";
//                             }
//                             else
//                             {
//                                 tablehtml += "<p>" +tablejson[trjson].xzqy + "</p>";
//                                 tablehtml += "<p> " +tablejson[trjson].lm + "</p>";
//                                 tablehtml += "<p> " +tablejson[trjson].zdfw + "</p>";
//                                 tablehtml += "<p> " +tablejson[trjson].fjbzw + "</p>";
//                                 tablehtml += "<p> " +tablejson[trjson].ztjb + "</p>";
//                                 tablehtml += "<p >建造日期： " +tablejson[trjson].jtrq + "</p>";
//                             }
//                             tablehtml += "</td>";
//                         }
//                         //当站亭是非删除状态时才去判断站牌的删除状态
//                         if(AlltdFontClass=="") {
//                             if ((tablejson[trjson].zpscrq != null && tablejson[trjson].zpscrq != "") || (tablejson[trjson].zpscrq_fgs != null && tablejson[trjson].zpscrq_fgs != "") ) {//if($ztItem["shzt"]=="删除")
//                                 tdFontClass = "deleteContent";
//                             }
//                             else  tdFontClass = "";
//                         }
//                         else{
//                             tdFontClass = AlltdFontClass;//站亭为删除状态，不需要再判断站牌了，所有的ZP全部用横线
//                         }
//
//                         //位置序号
//                         var wzxhhtml ="";var newwzphhtml ="";var oldwzphhtml ="";var newdxcxhtml ="";var olddxcxhtml ="";
//                         if(tablejson[trjson].wzph!= tablejson[trjson].wzph_fgs)
//                         {
//                             newwzphhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].wzph_fgs) + "</p>";
//                             oldwzphhtml+="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].wzph) + "</p>";
//                         }
//                         else{
//                             newwzphhtml +="<p>" +checkNull(tablejson[trjson].wzph_fgs) + "</p>";
//                             oldwzphhtml+="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].wzph) + "</p>";
//                         }
//                         if(tablejson[trjson].dxcx!= tablejson[trjson].dxcx_fgs)
//                         {
//                             newdxcxhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].dxcx_fgs) + "</p>";
//                             olddxcxhtml +="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].dxcx) + "</p>";
//                         }
//                         else
//                         {
//                             newdxcxhtml +="<p >" +checkNull(tablejson[trjson].dxcx_fgs) + "</p>";
//                             olddxcxhtml +="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].dxcx) + "</p>";
//                         }
//                         var wzxhhtml = newwzphhtml + newdxcxhtml +"<br/>"+oldwzphhtml+olddxcxhtml;
//                         tablehtml +="<td class='"+tdFontClass+"'>"+wzxhhtml+"</td>";//位置序号
//
//
//                         //灯箱编号
//                         var dxtrhtml ="";var newdxbhhtml ="";var olddxbhhtml ="";var oldgghhtml ="";var newgghhtml ="";
//                         newdxbhhtml = "<p>" +checkNull(tablejson[trjson].zpbh) + "</p>";
//                         olddxbhhtml = "<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].zpbh) + "</p>";
//                         if(tablejson[trjson].ggh!= tablejson[trjson].ggh_fgs) {
//                             newgghhtml = "<p class='"+newclass+"'> " + checkNull(tablejson[trjson].ggh_fgs) + "</p>";
//                             oldgghhtml = "<p class='"+oldclass+"'> " + checkNull(tablejson[trjson].ggh) + "</p>";
//                         }
//                         else{
//                             newgghhtml = "<p> " + checkNull(tablejson[trjson].ggh_fgs) + "</p>";
//                             oldgghhtml = "<p  class='"+hiddenclass+"'> " + checkNull(tablejson[trjson].ggh) + "</p>";
//                         }
//                         dxtrhtml = newdxbhhtml + newgghhtml +"<br/>"+ olddxbhhtml+oldgghhtml;
//                         tablehtml +="<td  class='"+tdFontClass+"'>"+dxtrhtml+"</td>";//灯箱编号
//
//                         //灯箱建造方式
//                         var jzfstdhtml ="";var newjzfshtml="";var oldjzfshtml="";var newlyqshtml ="";var oldlyqshtml ="";
//
//                         if(tablejson[trjson].dxjzfs !=tablejson[trjson].dxjzfs_fgs) {
//                             jzfstdhtml = "<p class='" + newclass + "'>" + checkNull(tablejson[trjson].dxjzfs_fgs) + "</p>";
//                             if(tablejson[trjson].dxjzfs_fgs!="自建") jzfstdhtml += "<br/><p class='" + newclass + "'>" + checkNull(tablejson[trjson].dxly_fgs) + "/" + checkNull(tablejson[trjson].dxqs_fgs) + "</p>";
//                             jzfstdhtml +="<br/><p class='" + oldclass + "'>" + checkNull(tablejson[trjson].dxjzfs) + "</p>";
//                             if(tablejson[trjson].dxjzfs!="自建")jzfstdhtml += "<br><p class='"+oldclass+"'><p>" + checkNull(tablejson[trjson].dxly) + "/" + checkNull(tablejson[trjson].dxqs) + "</p>";
//                         }
//                         else
//                         {
//                             if(tablejson[trjson].dxly_fgs != tablejson[trjson].dxly || tablejson[trjson].dxqs != tablejson[trjson].dxqs_fgs)
//                             {
//
//                                 jzfstdhtml = "<p>" + checkNull(tablejson[trjson].dxjzfs) + "</p>";
//                                 if(tablejson[trjson].dxjzfs_fgs!="自建") jzfstdhtml += "<br/><p class='" + newclass + "'>" + checkNull(tablejson[trjson].dxly_fgs) + "/" + checkNull(tablejson[trjson].dxqs_fgs) + "</p>";
//                                 jzfstdhtml +="<br/><p class='"+hiddenclass+"'>" + checkNull(tablejson[trjson].dxjzfs) + "</p>";
//                                 if(tablejson[trjson].dxjzfs!="自建")jzfstdhtml += "<br><p class='"+oldclass+"'><p>" + checkNull(tablejson[trjson].dxly) + "/" + checkNull(tablejson[trjson].dxqs) + "</p>";
//                             }
//                             else
//                             {
//                                 jzfstdhtml = "<p>" + checkNull(tablejson[trjson].dxjzfs_fgs) + "</p>";
//                                 if(tablejson[trjson].dxjzfs_fgs!="自建") jzfstdhtml += "<br/><p class='"+hiddenclass+"'>" + checkNull(tablejson[trjson].dxly_fgs) + "/" + checkNull(tablejson[trjson].dxqs_fgs) + "</p>";
//                                 jzfstdhtml +="<br/><p class='" + hiddenclass + "'>" + checkNull(tablejson[trjson].dxjzfs) + "</p>";
//                                 if(tablejson[trjson].dxjzfs!="自建")jzfstdhtml += "<br><p class='"+hiddenclass+"'><p>" + checkNull(tablejson[trjson].dxly) + "/" + checkNull(tablejson[trjson].dxqs) + "</p>";
//                             }
//                         }
//                         tablehtml +="<td  class='"+tdFontClass+"'>"+jzfstdhtml+"</td>";//灯箱来源
//
//                         //常规属性
//                         var sxtdhtml ="";var newksmchtml ="";var oldksmchtml ="";var newztlxhtml ="";var oldztlxhtml ="";
//                         if(tablejson[trjson].ksmc!= tablejson[trjson].ksmc_fgs)
//                         {
//                             newksmchtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].ksmc_fgs) + "</p>";
//                             oldksmchtml+="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].ksmc) + "</p>";
//                         }
//                         else{
//                             newksmchtml +="<p>" +checkNull(tablejson[trjson].ksmc_fgs) + "</p>";
//                             oldksmchtml+="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].ksmc) + "</p>";
//                         }
//                         if(tablejson[trjson].ztlx_id!= tablejson[trjson].ztlx_id_fgs)
//                         {
//                             newztlxhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].ztlx_id_fgs) + "</p>";
//                             oldztlxhtml +="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].ztlx_id) + "</p>";
//                         }
//                         else
//                         {
//                             newztlxhtml +="<p >" +checkNull(tablejson[trjson].ztlx_id_fgs) + "</p>";
//                             oldztlxhtml +="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].ztlx_id) + "</p>";
//                         }
//                         sxtdhtml = newksmchtml + newztlxhtml +"<br/>"+ oldztlxhtml+oldztlxhtml;
//                         tablehtml +="<td  class='"+tdFontClass+"'>"+sxtdhtml+"</td>";//常规属性
//
//                         //特殊属性
//                         var tssxtdhtml ="";var newzpzthtml ="";var oldzpzthtml ="";var newdmdxhtml ="";var olddmdxhtml ="";
//                         if(tablejson[trjson].zpzt!= tablejson[trjson].zpzt_fgs)
//                         {
//                             newzpzthtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].zpzt_fgs) + "</p>";
//                             oldzpzthtml+="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].zpzt) + "</p>";
//                         }
//                         else{
//                             newzpzthtml +="<p>" +checkNull(tablejson[trjson].zpzt_fgs) + "</p>";
//                             oldzpzthtml+="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].zpzt) + "</p>";
//                         }
//                         if(tablejson[trjson].dmdx!= tablejson[trjson].dmdx_fgs)
//                         {
//                             newdmdxhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].dmdx_fgs) + "</p>";
//                             olddmdxhtml +="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].dmdx) + "</p>";
//                         }
//                         else
//                         {
//                             newdmdxhtml +="<p >" +checkNull(tablejson[trjson].dmdx_fgs) + "</p>";
//                             olddmdxhtml +="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].dmdx) + "</p>";
//                         }
//                         tssxtdhtml = newzpzthtml + newdmdxhtml +"<br/>"+ oldzpzthtml+olddmdxhtml;
//                         tablehtml +="<td  class='"+tdFontClass+"'>"+tssxtdhtml+"</td>";//特殊属性
//                         //通电
//                         var tdtdhtml ="";var newdxtdfshtml ="";var olddxtdfshtml ="";var newtdrqhtml ="";var oldtdrqhtml ="";
//                         if(tablejson[trjson].dxtdfs!= tablejson[trjson].dxtdfs_fgs)
//                         {
//                             newdxtdfshtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].dxtdfs_fgs) + "</p>";
//                             olddxtdfshtml+="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].dxtdfs) + "</p>";
//                         }
//                         else{
//                             newdxtdfshtml +="<p>" +checkNull(tablejson[trjson].dxtdfs_fgs) + "</p>";
//                             olddxtdfshtml+="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].dxtdfs) + "</p>";
//                         }
//                         if(tablejson[trjson].tdrq!= tablejson[trjson].tdrq_fgs)
//                         {
//                             newtdrqhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].tdrq_fgs) + "</p>";
//                             oldtdrqhtml +="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].tdrq) + "</p>";
//                         }
//                         else
//                         {
//                             newtdrqhtml +="<p >" +checkNull(tablejson[trjson].tdrq_fgs) + "</p>";
//                             oldtdrqhtml +="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].tdrq) + "</p>";
//                         }
//                         tdtdhtml = newdxtdfshtml + newtdrqhtml +"<br/>"+ olddxtdfshtml+oldtdrqhtml;
//                         tablehtml +="<td  class='"+tdFontClass+"'>"+tdtdhtml+"</td>";//通电
//
//                         //拆除
//                         var cctdhtml ="";var newzpscrqhtml ="";var oldzpscrqhtml ="";var newzpsclxhtml ="";var oldzpsclxhtml ="";
//                         if(tablejson[trjson].zpscrq!= tablejson[trjson].zpscrq_fgs)
//                         {
//                             newzpscrqhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].zpscrq_fgs) + "</p>";
//                             oldzpscrqhtml+="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].zpscrq) + "</p>";
//                         }
//                         else{
//                             newzpscrqhtml +="<p>" +checkNull(tablejson[trjson].zpscrq_fgs) + "</p>";
//                             oldzpscrqhtml+="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].zpscrq) + "</p>";
//                         }
//                         if(tablejson[trjson].zpsclx!= tablejson[trjson].zpsclx_fgs)
//                         {
//                             newzpsclxhtml +="<p  class='"+newclass+"'>" +checkNull(tablejson[trjson].zpsclx_fgs) + "</p>";
//                             oldzpsclxhtml +="<p  class='"+oldclass+"'>" +checkNull(tablejson[trjson].zpsclx) + "</p>";
//                         }
//                         else
//                         {
//                             newzpsclxhtml +="<p >" +checkNull(tablejson[trjson].zpsclx_fgs) + "</p>";
//                             oldzpsclxhtml +="<p  class='"+hiddenclass+"'>" +checkNull(tablejson[trjson].zpsclx) + "</p>";
//                         }
//                         cctdhtml = newzpscrqhtml + newzpsclxhtml +"<br/>"+ oldzpscrqhtml+oldzpsclxhtml;
//
//                         tablehtml +="<td   class='"+tdFontClass+"'>"+cctdhtml+"</td>";//拆除日期
//                         tablehtml +="</tr>";
//                         index++;
//                     }
//                     $("#table-box tbody").append(tablehtml);
//                     if (hasqyfzmc)//没有区域分组的直接隐藏
//                         $(".qyfzmcspan").show();
//                     else
//                         $(".qyfzmcspan").hide();
//
//                 }
//                 else{
//                     menuShowDialogTips("没有任何数据");
//                 }
//             }else {
//                 menuShowDialogTips(result.msg);
//             }
//         },
//         error:function (result) {
//             menuShowDialogTips("查询失败");
//         }
//     });
// }
//

function  checkValue(val) {
    if(!val) //val is undefine
        return true;
    else if(val==null)
        return true;
    else if(val=="")
        return true;
    else return false;
}

//避免NULL值
function checkNull(returnvalue) {
    if(returnvalue)
        return returnvalue;
    else return "";
}

//避免NULL值
function checkNullDefault(returnvalue,defaultvalue) {
    if(returnvalue)
        return returnvalue;
    else return defaultvalue;
}

function checkNullWithOhter(returnvalue,otherstr) {
    if(returnvalue)
        return otherstr+returnvalue;
    else return "";
}


function  zpsh(tgzt) {
    var zt = tgzt=="通过"?"Yes":"No";
    $.ajax({
        url: window.httplink+"/"+"edit_zpsh",
        type: "POST",
        async: false,
        data:{
            "userid":userid,
            "csm":csm,
            "ztpk":ztobj.zt_pk_fgs,
            "tgzt":zt,
            "tjsj":ztobj.xgsj_fgs
        },
        dataType: "json",
        success: function (result) {
            if(result.code=="0")
            {//修改成功
                artDialog.data("return_modifyState", true);
                artDialog.data("return_tgzt", tgzt);
                artDialog.close();
            }
            else{
                menuShowDialogTips(result.msg);
            }
        },
        error:function (result) {
            menuShowDialogTips("审核失败");
        }
    });
}


