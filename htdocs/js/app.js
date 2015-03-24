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
})(jQuery);