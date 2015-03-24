(function($){
	$(window).load(function(){
		$('[cs-fixHeight]').each(function(){
			var id = $(this).attr('cs-fixHeight');	
			var h = $('#'+id).height();
			$(this).height(h);
		});
	});
	$.fn.center = function(){
		var _self = this;
		var PW = $(window).width(),PH = $(window).height();
		var SW = _self.width(),SH = _self.height();
		_self.css({
			position:'fixed',
			left:(PW-SW)/2,
			top:(PH-SH)/2
		});
	};
	$.fn.number = function(options){
		var defaults = {
			onChange:false,
		};
		var opts = $.extend({},defaults,options);
		var _self = this;
		var currentValue = parseInt(_self.text());
		var reduce = _self.prev();
		var plus = _self.next();
		var timer;
		reduce.click(function(){
			if(currentValue > 1){
				currentValue--;
				if(opts.onChange){
					timer = window.setTimeout(function(){
						opts.onChange.apply(this,_self);
					},100);
				}
			}
			_self.text(currentValue);
		});
		plus.click(function(){
			currentValue++;
			_self.text(currentValue);
			if(opts.onChange){
				timer = window.setTimeout(function(){
					opts.onChange.apply(this,_self);
				},100);
			}
		});
	}
	$('body').imagesLoaded(function(){
		var h1 = $('.am-container').get(0).offsetHeight;
		var h2 = $(window).height()-$('.am-header').height()-$('.am-footer-nav').height();
		if(h1<h2){
			if($('.am-container').hasClass('am-container-nopadding')){
				$('.am-container').height(h2);
			}else{
				var padding = $('.am-container').css('padding');
				h2 = h2 - parseInt(padding)*2;
				$('.am-container').height(h2);
			}
		}
	});
	
	
	//login_check
	
	
	var base="http://platform.91zmt.com";
	$("#login_in").on("click",function(){
		var username=$("input[name='lo_username']").val();
		var pwd=$("input[name='lo_pwd']").val();
		if(username=="")
		{
			alert("用户名不能为空");
			return false;
		}
		else if(pwd=="")
		{
			alert("密码不能为空");
			return false;
		}
		
		$.ajax({
			url : base+"/interface/signup",
			type : "post" ,
			dataType : "JSON",
			data : {webcode:"fangjiwei",uid:2,account:13800138000,password:111,action:"login"},
			success : function(data){
				$.each(data,function(){
					alert(data.msg);
					localStorage.setItem(username,username);
					localStorage.setItem(password,pwd);
					window.location.href="userCenter.html";
				});
			},
			error : function() {
				alert(1);
			}
		})
	});

	//register
   $("#register_in").on("click",function(){
    var username=$("input[name='re_username']").val();
    var tel=$("input[name='re_tel']").val();
    var pwd=$("input[name='re_pwd']").val();
    var pwd2=$("input[name='re_pwd2']").val();
    if(username=="")
    {
      alert("用户名不能为空");
      return false;
    }
    else if(tel=="")
    {
      alert("电话不能为空");
      return false;
    }
    else if(pwd=="")
    {
      alert("密码不能为空");
      return false;
    }
    else if(pwd!=pwd2)
    {
      alert("密码不一致");
      return false;
    }
    $.ajax({
      url : base+"/interface/signup",
      type : "POST",
      dataType : "JSON",
      data : {
          webcode:"fangjiwei",
          uid:2,
          account:13800138000,
          password:111,
          action:"regist"
      },
      success : function(data){
        $.each(data,function(){
          console.log(data);
        });
      },
      error : function(){
        alert(1);
      }
    });
  });
	
		
})(jQuery);

