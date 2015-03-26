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
			alert("待完成");
			app.showListViewById("#food-form-order");
		break;
		/**套房*/
		case 3:
			$.ajax({
			url : app.base+"/interface/product",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:app.webcode,uid:app.uid,cid:cid||0},
			success : function(data){
				var result = "";
//onoff  Y 表示上架使用的状态
//stock 库存
/*
 {"logo":"/assets/img/ui-sam.jpg","stock":36,"onoff":"Y","listId":3,"description":"豪华客房，双人床，带双早","createdate":"Thu Mar 26 18:25:58 CST 2015","deleflag":"N","unitPrice":"560","productName":"凤凰别墅","productId":36,"creator":"testuser"}
*/			
				var length = data.length;
				//var i = 0;
				//$.each(data,function(){
				//	result += '<table class="am-table am-orderList" style="margin-bottom:'+(i==length-1?0:4)+'">'+
   		          result += '<table class="am-table am-orderList" style="margin-bottom:0)">'+
				           '<tr onClick="window.location=\'orderDetail.html?tid='+ app.getQueryParam("pid") +'&pid='+ data.productId +'\'">'+
						   '<td><div class="am-g-face">'+
//						   '<a href="orderDetail.html?pid='+ data.productId +'">'+
						   '<img src="'+(app.base+ data.logo)+'"/>'+
						   //'</a>'+
						   '</div></td><td>'+
                	       '<div class="am-g-info am-pos-re">'+
                           '<div class="am-text-sm b"><span>'+ data.productName +
						   '</span><span class="am-margin-left-xs am-text-danger">'+
						   '</span></div><div class="am-text-color-gray am-text-xs">'+
						   '<span>'+data.description+'</span></div>'+
                           '<div class="am-text-lg am-text-danger b">￥'+data.unitPrice+'</div>'+
                           '</div></td><td><button type="button" class="am-btn am-btn-success '+
						   'am-btn-xs am-margin-bottom-xs">'+
						   '预订</button></td></tr></table>';
//				});
				$("#appListView").html(result);
				app.showListViewById("#house-form-order");
			},
			error : function() {
				alert(1);
			}
		});
		break;
		default:
			alert("sorry. 不知道该怎么办.");
		break;
	}

};
(function($){
	//pay
	app.hideListView();
	app.loadAppList(app.getQueryParam("pid"), app.getQueryParam("cid")); 
})(jQuery);