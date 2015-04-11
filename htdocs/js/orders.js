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
 /*
地址: http://platform.91zmt.com/interface/order/list
方式：post
参数
String webcode 值见其他接口
Integer uid 放鸡岛微官网写死是2
Integer user 用户登入后返回的ID
String signature 用户登入后返回的signature
Integer page 页码
Integer pagesize 分页大小
String status 三种值：payment 未支付（包含支付中）订单，success 支付成功未消费， finish 支付成功已消费

返回
{result:true,msg:'错误信息',data:[{
  订单1 json对象
},{
  订单2 json对象
}]}

订单对象属性与生成订单接口返回内容相同。

请根据接口对个人中心的订单列表进行动态化实现

orderNo 订单号
checkIn
checkOut;
qty;
productId;
productName;
unitPrice;
logo;
description;
totalCost; 总价
customerId; 如果有登入，登入用户的ID
mobilePhone; 手机
idNo; 身份证
remark; 备注
customerName; 姓名
orderStatus; 订单状态，返回的都是create
unitDiscount; 单价折扣
 */
/**
 * 加载未支付的订单信息
 * @param int pageNo 第几页 
 * @param int pageSize 分页大小
 */
app.paymentOrders = function(pageNo, pageSize){
	pageNo = parseInt(pageNo);
	$.ajax({
			url : app.base+"/interface/order/list",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode, uid:app.uid, user:localStorage.getItem("user"), signature:localStorage.getItem("signature"), 
			        page:pageNo, pagesize:pageSize||10, status:"payment"},
			success : function(data){
				var result = "<tr><td>暂时还没有订单信息</td></tr>";
				if(data.result == true || data.result == "true") {
					data = data["data"];
					console.log(JSON.stringify(data));
					var length = data.length;
					
					if(length > 0) {
						result = "";
						for(var i = 0; i < length; i++) {
							result += '<tr>' +
            	             '<td><div class="am-g-face"><a href="orderDetail.html"><img src="'+data[i].logo+'"/></a></div></td>' + 
            	             '<td><div class="am-g-info am-pos-re">' +
                             '<div class="am-text-sm"><b>'+data[i].productName+'</b></div>' + 
                             '<div class="am-text-color-gray am-text-xs"><span>价格：Y'+ data[i].unitPrice +'</span>' + 
                             '<span class="am-margin-left-xs">数量:'+data[i].qty+'</span></div>' + 
                             '<div class="am-text-sm am-text-color-green">待付款</div>' + 
                             '</div></td><td>' +
                             '<button type="button" class="am-btn am-btn-success am-btn-xs am-margin-bottom-xs" ' + 
                             'onClick="window.location=\'pay.html?order_no=' + data[i].orderNo +'&action=pay\'">付款</button>' + 
                             '</td></tr>';
				       }

					} 
				} else{
					alert(data.msg);
				} 
				
				
				$("#payment-order-list").html(result);
				
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert(1);
			}
		});
};
/**
 * 加载已支付但未消费的订单信息
 * @param int pageNo 第几页 
 * @param int pageSize 分页大小
 */
app.successOrders = function(pageNo, pageSize){
	pageNo = parseInt(pageNo);
	$.ajax({
			url : app.base+"/interface/order/list",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode, uid:app.uid, user:localStorage.getItem("user"), signature:localStorage.getItem("signature"), page:pageNo, pagesize:pageSize||10, status:"success"},
			success : function(data){
				var result = "<tr><td>暂时还没有订单信息</td></tr>";
				if(data.result == true || data.result == "true") {
					data = data["data"];
					console.log(JSON.stringify(data));
					var length = data.length;
					
					if(length > 0) {
						result = "";
						for(var i = 0; i < length; i++) {
							result += '<tr>' +
            	             '<td><div class="am-g-face"><a href="orderDetail.html"><img src="'+data[i].logo+'"/></a></div></td>' + 
            	             '<td><div class="am-g-info am-pos-re">' +
                             '<div class="am-text-sm"><b>'+data[i].productName+'</b></div>' + 
                             '<div class="am-text-color-gray am-text-xs"><span>价格：Y'+ data[i].unitPrice +'</span>' + 
                             '<span class="am-margin-left-xs">数量:'+data[i].qty+'</span></div>' + 
                             '<div class="am-text-sm am-text-color-green">待消费</div>' + 
                             '</div></td><td>' +
                             '<button type="button" class="am-btn am-btn-success am-btn-xs am-margin-bottom-xs" ' + 
                             'onClick="window.location=\'pay.html?order_no=' + data[i].orderNo +'&action=pay\'">付款</button>' + 
                             '</td></tr>';
				       }

					} 
				} else{
					alert(data.msg);
				} 
				
				
				$("#success-order-list").html(result);

			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert(1);
			}
		});
};
/**
 * 加载已支付已消费的订单信息
 * @param int pageNo 第几页 
 * @param int pageSize 分页大小
 */
app.finishOrders = function(pageNo, pageSize){
	pageNo = parseInt(pageNo);
	$.ajax({
			url : app.base+"/interface/order/list",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode, uid:app.uid, user:localStorage.getItem("user"), signature:localStorage.getItem("signature"), page:pageNo, pagesize:pageSize||10, status:"finish"},
			success : function(data){
				 var result = "<tr><td>暂时还没有订单信息</td></tr>";
				if(data.result == true || data.result == "true") {
					data = data["data"];
					console.log(JSON.stringify(data));
					var length = data.length;
					
					if(length > 0) {
						result = "";
						for(var i = 0; i < length; i++) {
							result += '<tr>' +
            	             '<td><div class="am-g-face"><a href="orderDetail.html"><img src="'+data[i].logo+'"/></a></div></td>' + 
            	             '<td><div class="am-g-info am-pos-re">' +
                             '<div class="am-text-sm"><b>'+data[i].productName+'</b></div>' + 
                             '<div class="am-text-color-gray am-text-xs"><span>价格：Y'+ data[i].unitPrice +'</span>' + 
                             '<span class="am-margin-left-xs">数量:'+data[i].qty+'</span></div>' + 
                             '<div class="am-text-sm am-text-color-green">待评价</div>' + 
                             '</div></td><td>' +
                             '<button type="button" class="am-btn am-btn-success am-btn-xs am-margin-bottom-xs" ' + 
                             'onClick="window.location=\'pay.html?order_no=' + data[i].orderNo +'&action=pay\'">付款</button>' + 
                             '</td></tr>';
				       }

					} 
				} else{
					alert(data.msg);
				} 
				
				
				$("#finish-not-assess-order-list").html(result);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert(1);
			}
		});
};

(function($){
	app.paymentOrders(1, 10);
    app.successOrders(1, 10);
    app.finishOrders(1, 10);
})(jQuery);