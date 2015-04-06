// JavaScript Document
/*
接口地址:  platform.91zmt.com//interface/order
method=post
 
 接口提交参数
String webcode 放鸡岛微官代码 =fangjiwei
int uid 写死放鸡岛的id  =2
String cid  栏目ID
int user 登入用户的userid，见登入接口返回，可为空
String signature  登入用户的参数，见登入接口返回，可为空
String checkin 酒店checkin日期，可为空，但酒店类的产品传空值会报错
String checkout 酒店checkout日期，可为空，但酒店类的产品传空值会报错
String name 客户姓名 可为空，酒店类必填
String mobilephone 联系手机，可为空，酒店类必填，会验证手机号码格式
String idnumber 身份证号，可为空，酒店类必填，会验证身份证号格式
String date  预订日期，可为空，非酒店类订单时填写，如餐饮套餐的用餐日期
int productId 产品ID，见产品接口返回
int qty 购买产品数量，酒店类订单会根据checkin和checkout日期验证住酒店的多少晚
String remark 备注，酒店类订单的住宿人数之类可以加到remark里一起传过来


返回数据，JSON格式
{result:true, msg:'错误时返回说明', data:{//订单属性，见下边}}

//订单属性，就是产品的一些属性+订单提交时的一些属性
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
 * 获取本地存储的值
 * @param string key
 */
app.getLocalStorageByKey = function(key){return localStorage.getItem(key);};
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
app.compare = {
	cid:function(sId){
		var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",
		           35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",
		           53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
		var iSum=0
		var info=""
		if(!/^d{17}(d|x)$/i.test(sId))return false;
		sId=sId.replace(/x$/i,"a");
		if(aCity[parseInt(sId.substr(0,2))]==null)return "Error:非法地区";
		sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
		var d=new Date(sBirthday.replace(/-/g,"/"));
		if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "Error:非法生日";
		for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11);
		if(iSum%11!=1)return "Error:非法证号";
		//return aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?" 男":"女");
        return;
	}, text: function(txt){
		if(undefined != txt && txt != "" && txt.length > 0) return true;
		return false;
	}, phone: function(txt){
		 var patrn = /^(13[0-9]{9})|(14[0-9])|(18[0-9])|(15[0-9][0-9]{8})$/;
        if (!patrn.exec(txt)) return false
        return true
	}	
};
/**
 * 获取时间
 * @param int year
 * @param int month
 * @param int date
 */
app.getDates = function(year, month, date){
	var time = new Date();
	if(year < time.getYear()) return;
	time.setFullYear(year);
	time.setMonth(month-1);
	time.setDate(date);
	time.setHours(0)
	time.setMinutes(0);
	time.setSeconds(0);
	time.setMilliseconds(0);
	return time;	
};
app.datepicker = {
	year:function(){var time = new Date(); return time.getFullYear();},
    month:function(){var time = new Date(); return time.getMonth();},
    date:function(){var time = new Date(); return time.getDate();},
    options:function(id /*, type*/){
    	var options = {
 			 altFormat: "yyyy-mm-dd",
 			 "setDate": app.datepicker.year()+"-"+(app.datepicker.month()<10?"0"+app.datepicker.month():app.datepicker.month())+"-"+ app.datepicker.date(),
 			 autoSize: true,
 			 changeYear: true,
 			 firstDay: 1,
 			 gotoCurrent: true,
             maxDate: "+1m +2w",
             minDate: new Date(app.datepicker.year(), app.datepicker.month(), app.datepicker.date()),
 			 dayNamesMin: [ "日", "一", "二", "三", "四", "五", "六" ],
 			 monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
 			 onSelect: function(dateText, inst) {
 			 	/*
 			 	if(type == "house-calendar-start") {
				 	$("#house-start-year").val(dateText.split("/")[2]);
			 		$("#house-start-month").val(dateText.split("/")[0]);
			 		$("#house-start-date").val(dateText.split("/")[1]);
 			 	} else if(type == "house-calendar-end"){
 			 		$("#house-end-year").val(dateText.split("/")[2]);
			 		$("#house-end-month").val(dateText.split("/")[0]);
			 		$("#house-end-date").val(dateText.split("/")[1]);
 			 	} else if(type == "house-start-datetime"){
 			 		$(id).val(dateText.split("/")[2] + "-" + dateText.split("/")[0] + "-" + dateText.split("/")[1]);
 			 	}	else if(type == "house-end-datetime"){
 			 		$(id).val(dateText.split("/")[2] + "-" + dateText.split("/")[0] + "-" + dateText.split("/")[1]);
 			 	}	     
 			 	*/
 			 	$(id).val(dateText.split("/")[2] + "-" + dateText.split("/")[0] + "-" + dateText.split("/")[1]);
 			 	var startDate =  $("#house-start-datetime").val();
 			 	var endDate = $("#house-end-datetime").val();
 			 	if( parseInt(startDate.split("-")[1]) == parseInt(endDate.split("-")[1])) {
 			 		if( parseInt(startDate.split("-")[2]) > parseInt(endDate.split("-")[2])) {
 			 			alert("结束日期不能小于开始日期.请重新选择日期.");
 			 		}
 			 	} else if( parseInt(startDate.split("-")[1]) > parseInt(endDate.split("-")[1])) {
 			 			alert("结束日期不能小于开始日期.请重新选择日期.");
 			 	}
             } 
	    }; 
	    return options;}
    };
app.initDate = function(){
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var date = time.getDate();
	$("#food-datetime,#house-start-datetime,#house-end-datetime").val(year + "-" + (month < 10 ? "0" + month : month) + "-" +  (date < 10 ? "0" + date : date));	
};
app.number = {add:function(numberBoxId){var v = parseInt($(numberBoxId).html()); $(numberBoxId).html(v+1); }, 
              lower:function(numberBoxId){var v = parseInt($(numberBoxId).html()); if(v>1)$(numberBoxId).html(v-1);}};
app.time = {year:{
				add:function(yearBoxId){var v = parseInt($(yearBoxId).html()); if(v<2015){v = ((v+1)< 10 ? "0"+(v+1):(v+1));$(yearBoxId).html(v);}},
			    lower:function(yearBoxId){var v = parseInt($(yearBoxId).html()); if(v>1){v = ((v-1)< 10 ? "0"+(v-1):(v-1));$(yearBoxId).html(v);}}
			 }, month:{
				add:function(monthBoxId){var v = parseInt($(monthBoxId).html()); if(v<12){v = ((v+1)< 10 ? "0"+(v+1):(v+1));$(monthBoxId).html(v);}},
			    lower:function(monthBoxId){var v = parseInt($(monthBoxId).html()); if(v>1){v = ((v-1)< 10 ? "0"+(v-1):(v-1));$(monthBoxId).html(v);}}
			 },
			date:{
                add:function(dateBoxId){var v = parseInt($(dateBoxId).html()); if(v<30){v = ((v+1)< 10 ? "0"+(v+1):(v+1));$(dateBoxId).html(v);}},
			    lower:function(dateBoxId){var v = parseInt($(dateBoxId).html()); if(v>1){v = ((v-1)< 10 ? "0"+(v-1):(v-1));$(dateBoxId).html(v);}}
			 
			} };
/***
  * 提交表单
  */
app.orderSubmit = function(){
	var tid = parseInt(app.getQueryParam("tid"));
	var pcid = app.getQueryParam("cid");
	var pid = app.getQueryParam("pid");
	var userId = app.getLocalStorageByKey("user");
	var signatureText = app.getLocalStorageByKey("signature");
    var username = "";
    var tel = "";
    var userIdNumber = "";
    var dateTime = "";
    var remarkText = "";//food-last-remark 
    var foodPeoples = 1;
    var housePeoples = 1;
	var gtyAmount = 0;
	var startDate = "";
	var endDate = "";
	
    if (tid == 2) {

/*String checkin 酒店checkin日期，可为空，但酒店类的产品传空值会报错
String checkout 酒店checkout日期，可为空，但酒店类的产品传空值会报错
String name 客户姓名 可为空，酒店类必填
String mobilephone 联系手机，可为空，酒店类必填，会验证手机号码格式
String idnumber 身份证号，可为空，酒店类必填，会验证身份证号格式
String date  预订日期，可为空，非酒店类订单时填写，如餐饮套餐的用餐日期
int productId 产品ID，见产品接口返回
int qty 购买产品数量，酒店类订单会根据checkin和checkout日期验证住酒店的多少晚
String remark 备注，酒店类订单的住宿人数之类可以加到remark里一起传过来*/
        housePeoples = $("#food-qty").val();
    	username = $("#food-username").val();
    	tel = $("#food-phone").val();
    	if(app.compare.text(tel) && !app.compare.phone(tel)){alert("请输入正确的手机号码"); return;}
    	gtyAmount = $("#food-form-order-detail-amount").val();
    	dateTime = $("#food-datetime").val();
		remarkText = $("#food-last-remark").val();
    } else if(tid == 3){
    	housePeoples = $("#house-qty").val();
    	username = $("#house-username").val();
    	tel = $("#house-phone").val();
    	userIdNumber = $("#house-userid").val();
    	startDate = $("#house-start-datetime").val();
    	endDate = $("#house-end-datetime").val();

    	if(!app.compare.text(username)) {alert("请输入用户名.");return;}
    	if(!app.compare.text(tel)){alert("请输入手机号码"); return;}
    	if( app.compare.text(tel) && !app.compare.phone(tel)){alert("请输入正确的手机号码"); return;}
    	if(!app.compare.text(userIdNumber)){alert("请输入身份证号码"); return;}

    	var compareSID = app.compare.cid(userIdNumber);
    	if(compareSID.length > 0) {alert(compareSID);return;}
    	if( parseInt(startDate.split("-")[1]) == parseInt(endDate.split("-")[1])) {
 			if( parseInt(startDate.split("-")[2]) > parseInt(endDate.split("-")[2])) {
 				alert("结束日期不能小于开始日期.请重新选择日期.");
 				return;
 			}
 		} else if( parseInt(startDate.split("-")[1]) > parseInt(endDate.split("-")[1])) {
 				alert("结束日期不能小于开始日期.请重新选择日期.");
 				return;
 		}
 		var _startYear = parseInt(startDate.split("-")[0]);
 		var _startMonth = parseInt(startDate.split("-")[1]);
 		var _startDate = parseInt(startDate.split("-")[2]);
 		var _endYear = parseInt(endDate.split("-")[0]);
 		var _endMonth = parseInt(endDate.split("-")[1]);
 		var _endDate = parseInt(endDate.split("-")[2]);
        var time = (app.getDates(_endYear, _endMonth, _endDate) - app.getDates(_startYear, _startMonth, _startDate)) / (1000*60*60*24);
     	gtyAmount = time + 1;
    	remarkText = $("#house-last-remark").val();
    }

	switch(tid){
		case 1:
		break;
		/**套餐*/
		case 2:
			//alert("待完成");
			//app.showListViewById("#food-form-order");
		//break;
		/**套房*/
		case 3:
	      $.ajax({
			url : app.base+"/interface/order",
			type : "post" ,
			dataType : "JSON",
			data : {webcode : app.webcode, uid : app.uid, user : userId, cid : pcid,
				    signature : signatureText, checkin : startDate, checkout : endDate, 
				    name : username, mobilephone : tel, idnumber : userIdNumber, 
				    date: dateTime, productId : pid, qty : gtyAmount, remark : remarkText},
			success : function(data){
				/*{"data":
				{"customerName":"test",
				"idNo":"441420199312081562",
				"createTime":"Sun Mar 29 19:36:12 CST 2015",
				"logo":"",
				"totalCost":"4.0E+2",
				"remark":"下单咯.:~",
				"qty":1,
				"unitPrice":"400.00",
				"orderStatus":"create",
				"checkIn":"Sun Mar 29 00:00:00 CST 2015",
				"productId":2,
				"unitDiscount":"0",
				"orderNo":"000000000010002",
				"checkOut":"Mon Mar 30 00:00:00 CST 2015",
				"mobilePhone":"13800138000",
				"description":"双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房双人房",
				"webid":1,
				"productName":"凤凰别墅,双人房"}}
				  
				  返回数据，JSON格式
{result:true, msg:'错误时返回说明', data:{//订单属性，见下边}}

//订单属性，就是产品的一些属性+订单提交时的一些属性
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
unitDiscount; 单价折扣*/
                if(data.result == false || data.result=="false") {
	                alert(data.msg);
				} else {
				    $("#view-order-detail-productName").html(data.data.productName);
	                $("#view-order-detail-unitPrice").html(data.data.unitPrice);
	                $("#view-order-detail-qtys01,#view-order-detail-qtys02").html(data.data.qty);
	                $("#view-order-detail-orderNo").html(data.data.orderNo);
					$("#view-order-detail-totalCost").html(parseFloat(data.data.totalCost));
					app.hideListView();                
					$("#view-order-detail-submit-btn").attr("onClick","window.location='pay.html?order_no=" + data.data.orderNo+"'");
					$("#view-order-detail-childsB").attr("style","padding-bottom: 50px;");
					app.showListViewById("#view-order-detail");		
					
				}
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
//转换日期格式 
app.parseISO8601 = function(dateStringInRange) { 
    var isoExp = /^s*(d{4})-(dd)-(dd)s*$/, 
        date = new Date(NaN), month, 
        parts = isoExp.exec(dateStringInRange); 
 
    if(parts) { 
      month = +parts[2]; 
      date.setFullYear(parts[1], month - 1, parts[3]); 
      if(month != date.getMonth() + 1) { 
        date.setTime(NaN); 
      } 
    } 
    return date; 
}; 
(function($){
	//pay
	app.hideListView();
    $("#view-order-detail-childsB").attr("style","padding-bottom: 50px;");
	var viewGroups = {t1:"#view-order-detail",t2:"#food-form-order-detail",t3:"#house-form-order-detail"};
	var viewId = viewGroups["t"+app.getQueryParam('tid')];
	$("#food-form-order-detail-unit,#house-form-order-detail-unit").html(app.getQueryParam("unit"));
	
	app.showListViewById(viewId?viewId:"#view-order-detail");
	app.initDate();
	$("#house-form-order-detail-btn-submit").on("click",function(){
		app.orderSubmit();
	});
	$("#food-form-order-detail-btn-add").on("click",function(){app.number.add("#food-form-order-detail-amount");});
	$("#food-form-order-detail-btn-lower").on("click",function(){app.number.lower("#food-form-order-detail-amount");});
	/*
    $("#house-start-year" ).datepicker(app.datepicker.options("#house-start-year","house-calendar-start"));
    $("#house-start-month" ).datepicker(app.datepicker.options("#house-start-month","house-calendar-start"));
    $("#house-start-date" ).datepicker(app.datepicker.options("#house-start-date", "house-calendar-start"));
    $("#house-end-year" ).datepicker(app.datepicker.options("#house-end-year","house-calendar-end"));
    $("#house-end-month" ).datepicker(app.datepicker.options("#house-end-month","house-calendar-end"));
    $("#house-end-date" ).datepicker(app.datepicker.options("#house-end-date","house-calendar-end"));
   */
    $("#house-start-datetime").datepicker(app.datepicker.options("#house-start-datetime"));
	$("#house-end-datetime").datepicker(app.datepicker.options("#house-end-datetime"));
	$("#food-datetime").datepicker(app.datepicker.options("#food-datetime"));
	

	$("#house-start-datetime").on("click", function(){
		$("#house-start-datetime").datepicker("show");
	});
	$("#house-end-datetime").on("click", function(){
		$("#house-end-datetime").datepicker("show");
	});
	$("#food-datetime").on("click", function(){
		$("#food-datetime").datepicker("show");
	});
})(jQuery);