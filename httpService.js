$.support.cors = true; //jq ajax兼容ie8的写法
var HttpService = {}
HttpService.loadings = function() {
	var domHg = $(document).height();
	$("body").append($('<div class="loadings" style="height:'+ domHg +'"><div class="ldbd"><i></i></div></div>').clone());
}

HttpService.loadingsRemove = function() {
	$(".loadings").remove();
}
HttpService.getQueryString = function(name) { //获取uri变量的值
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	var context = ""; 
	if (r != null) 
		 context = r[2]; 
	reg = null; 
	r = null; 
	return context == null || context == "" || context == "undefined" ? "" : context; 
}

HttpService.tips = function addTips(txt, wid, align, times){
	 if(typeof(times) == "undefined"){
		 times = 2500;
	 }
	 if($(".tips").length > 0){
		return; 
	 }else{
		 if(align == 0){
			 txtAlign = "left"
		 }else if(align == 1){
			 txtAlign = "center"
		 }else{
			 txtAlign = "right"
		 }
		var tipsObj = $('<div class="tips"><p style="width:'+ wid +'%; text-align:'+ txtAlign +'">'+ txt + '</p></div>');
		$("body").append(tipsObj);
		setTimeout(function(){
			$(".tips").animate({opacity:0}, 500, function(){
				$(".tips").remove();	
			});
		}, times);
	 }
}

HttpService.call = function(url, params, options) {
	var option = {};
	option.validate = function() {
		return true;
	}
	option.beforeSubmit = function() {
		//console.log('BeforeSubmit >>>> do you need me show animation ?');
	};
	option.success = function(response) {
		// console.log('SUCCESS >>>>'+response);
	};
	option.error = function(response) {
		//  console.log('ERROR >>>>'+response);
	};
	option.complete = function() {
		// console.log('Complete >>>> do you need me close animation ?');
	};
	$.extend(option, options);
	//do validation
	if (!option.validate()) {
		return false;
	}
	//before submit data handling
	option.beforeSubmit.call(this);
	// ajax call service
	
	//HttpService.loadings();
	$(".loadings").show();
	$.ajax({
		'url':url,
		'dataType' : 'json',// if you want to cross domain post ,you should use jsonp
		'type':"POST",// if you want to cross domain post ,you should use GET
		'traditional' : true, // Server only supports traditional style params
		'data' : params,
		'async' : true,
		'success' : function(response, status, xhr) {//response, status, xhr
			 option.success(response);
			 //HttpService.loadingsRemove();
			 $(".loadings").hide();
		},
		'error' : function(xhr, status, error) {
			//HttpService.loadingsRemove();
			$(".loadings").hide();
			if($.browser.msie) { 
				if((parseInt($.browser.version)) <= 8){ //<= ie8
					HttpService.tips("出错了！请使用高版本的浏览器或360浏览器切换为极速模式！", 80, 1, 7000);
				}
			}else{
				HttpService.tips("出错了！请稍后再试！", 80, 1, 5000);
			}
		},
		'complete' : function(res) { 
			//HttpService.loadingsRemove();
			 $(".loadings").hide();
			option.complete();
		}
	});
};
window.HttpService = HttpService;