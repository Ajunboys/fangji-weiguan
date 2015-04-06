var app = app || {};
app.base = "http://platform.91zmt.com";
app.webcode = "fangjiwei";
app.uid = 2;
/**
 * 获取URL中的请求参数
 * @param string name 需要查找的请求参数名称
 * @return string 请求参数对应的值
 */
app.getQueryParam = function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
};
/**
 * 隐藏所有produce view
 */
app.hideListView = function(){
	$("body").children().css({display:"none", visibility:"hidden"});
};
/**
 * 需要显示的view
 * @param string id view对应的id(#+id)
 */
app.showListViewById = function(id){
	$(id).css({display:"block",visibility:"visible"});
};
/**
 * 银联WAP(upmp_wap)、银联WAP(upacp_wap)、支付宝WAP(alipay_wap)、支付宝手机支付(alipay)、微信支付(wx)、百付宝WAP(bfb_wap)
 * @param string channel (value = upmp_wap | upacp_wap | alipay_wap | alipay | wx | bfb_wap) 暂时实现支付宝(网页支付和手机端支付)和微信支付
 */
app.wap_pay = function (channel) {
/*  var jqxhr = $.post("example.php", function() {
      alert("success");
    })
    .success(function() { alert("second success"); })
    .error(function() { alert("error"); })
    .complete(function() { alert("complete"); });

    // 在这里执行其他任务
	
    // 为上面的请求设置另一个完成函数
    jqxhr.complete(function(){ alert("second complete"); });*/
  /*      var xhr = new XMLHttpRequest();
	    xhr.open("POST", app.base + "/interface/PingPlusPayment", true);
	    xhr.setRequestHeader("Content-type", "application/json");
	    xhr.send(JSON.stringify({
		    channel: channel.toString(),
		    order_no: app.getQueryParam("order_no"),
		    webcode: app.webcode
	    }));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert("wap_pay success:" + xhr.responseText);
                pingpp.createPayment(xhr.responseText, function(result, err) {
                	if(result=="success"){
                       alert("pay success:"+result);
	                } else {
	                    console.log(result+" "+err.msg+" "+err.extra);
	                }
                });
            } else {
            	alert("pay fail:[readyState=" + xhr.readyState + ", status=" + xhr.status + "]");
            }
        }
};
        */
        $.ajax({
		type: "POST",
		url: app.base + "/interface/PingPlusPayment",
		data: {
		    channel: channel.toString(),
		    order_no: app.getQueryParam("order_no"),
		    webcode: app.webcode
	    },
		success: function(data){
			alert(data);
			pingpp.createPayment(data, function(result, err) {
                	if(result=="success"){
                       alert("pay success:"+result);
	                } else {
	                    console.log(result+" "+err.msg+" "+err.extra);
	                }
                });
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			alert("pay fail");
		}
		});
/*
   var action = app.base + "/interface/PingPlusPayment" + "?channel=" + channel.toString() + "&" + 
   				"order_no=" + app.getQueryParam("order_no") + "&" + "webcode=" + app.webcode; 
   var jqxhr = $.post(action, function() {
      alert("success");
    })
    .success(function(data) { 
    	alert("second success"); 
    	pingpp.createPayment(data, function(result, err) {
                	if(result=="success"){
                       alert("pay success:"+result);
	                } else {
	                    console.log(result+" "+err.msg+" "+err.extra);
	                }
                });
    })
    .error(function() { alert("pay fail"); })
    .complete(function() { alert("complete"); });

    // 在这里执行其他任务
	
    // 为上面的请求设置另一个完成函数
    jqxhr.complete(function(){ alert("second complete"); });*/
	
};	
/**
 * 加载产品信息
 * @param int pid 产品类型(区分view部分)
 * @param int cid 产品id
 */
app.loadAppList = function(pid, cid){
	pid = parseInt(pid);
	switch(pid){
		case 1:
		break;
		/**套餐*/
		case 2:
		//	alert("等待设计需求文档中....");
		//	app.showListViewById("#food-form-order");
		//break;
		/**套房*/
		case 3:
			$.ajax({
			url : app.base+"/interface/product",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode,uid:app.uid,cid:cid||0},
			success : function(data){
				var result = (pid==2)?"没有找到套餐对应的更多信息":"没有找到套房对应的更多信息";
				if(data.result == true || data.result == "true") {
					//onoff  Y 表示上架使用的状态
//stock 库存
/*
 {"logo":"/assets/img/ui-sam.jpg","stock":36,"onoff":"Y","listId":3,"description":"豪华客房，双人床，带双早","createdate":"Thu Mar 26 18:25:58 CST 2015","deleflag":"N","unitPrice":"560","productName":"凤凰别墅","productId":36,"creator":"testuser"}
*/			        data = data["data"];
					var length = data.length;
					if(length > 0) {
						result = "";
						for(var i = 0; i < length; i++) {
							var description = data[i].description;
				        	result += '<table class="am-table am-orderList" style="margin-bottom:'+(i==length-1?0:4)+'px;">'+
   		                   '<tr style="cursor: pointer;" onClick="window.location=\'orderDetail.html?cid='+ app.getQueryParam("cid") +'&tid='+ app.getQueryParam("pid") +'&pid='+ data[i].productId + "&unit="+data[i].unitPrice +'\'">'+
						   '<td><div class="am-g-face">'+
//						   '<a href="orderDetail.html?pid='+ data.productId +'">'+
						   '<img src="'+(app.base+ data[i].logo)+'"/>'+
						   //'</a>'+
						   '</div></td><td>'+
                	       '<div class="am-g-info am-pos-re">'+
                           '<div class="am-text-sm b"><span>'+ data[i].productName +
						   '</span><span class="am-margin-left-xs am-text-danger">'+
						   '</span></div><div class="am-text-color-gray am-text-xs">'+
						   '<span style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+ ((description.length > 10)?description.substring(0,10)+'...':description)+'</span></div>'+
                           '<div class="am-text-lg am-text-danger b">￥'+data[i].unitPrice+'</div>'+
                           '</div></td><td><button type="button" class="am-btn am-btn-success '+
						   'am-btn-xs am-margin-bottom-xs">'+
						   '预订</button></td></tr></table>';
				       }

					} 
				} 
				
				$("#appListView").html(result);
				app.showListViewById("#food-house-form-order");
			},
			error : function() {
				alert(1);
			}
		});
		break;
		default:
			 app.showListViewById("#wap_pay-form");
		break;
	}

};
(function($){
	//pay
	app.hideListView();
	app.loadAppList(app.getQueryParam("pid"), app.getQueryParam("cid")); 
	$("#wap_pay-form-submit-btn").on("click", function(){var channel = $("input[name='radio1']").val(); if(!!!!channel) app.wap_pay(channel);})
})(jQuery);