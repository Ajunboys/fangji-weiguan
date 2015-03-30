// JavaScript Document
/*
接口地址:  platform.91zmt.com//interface/order
method=post
提交参数：String webcode,  int uid,  String cid, Integer user 登入后返回的用户ID,  String signature 登入后返回的签名值, 
 String category 写死 ‘hotel’, Integer productId 上一个接口的返回值,  Integer qty 停留多少晚,  Date checkin 入住日期,  Date checkout 离店日期

返回订单创建信息,JSON格式，字段如下
orderNo 订单号
productName 产品名
checkin 入住日期
checkout 离店日期
qty 多少晚的酒店
totalCost 总共房价
user 用户登入后返回的ID
*/
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
 * 
 */
app.submit = function(userId,signatureText,pid,gtyAmount,startDate,endDate){
	$.ajax({
			url : app.base+"/interface/order",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode, uid:app.uid, user:userId,
				    signature:signatureText, category:"hotel", productId:pid,
				    gty: gtyAmount, checkin:startDate, checkout:endDate},
			success : function(data){
				/*orderNo 订单号
productName 产品名
checkin 入住日期
checkout 离店日期
qty 多少晚的酒店
totalCost 总共房价
user 用户登入后返回的ID*/
				console.log(JSON.stringify(data));
			},
			error : function() {
				alert(1);
			}
		});
};
/***
  * 加载初始数据
  * @param int pid 产品id
  * @param int tid 产品分类
  */
app.loadOrderDetail = function(pid, tid){
	console.log(pid + "," + tid);
};
(function($){
	//pay
	app.hideListView();
	app.loadOrderDetail(app.getQueryParam('pid'), app.getQueryParam('tid'));
})(jQuery);