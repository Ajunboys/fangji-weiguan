$(document).ready(function(){
	$('ul.one').hide();
	
	//Hide And Show Menu
	$('.nav li').hover(
	function(){
		var openMenu= $(this).children('ul.one');
		$(openMenu).show();
	},
	function(){
		var openMenu= $(this).children('ul.one');
		$(openMenu).hide();
	});
	//End

	
	//Links - Pading left
	$('#links .link-block li').hover(
	function(){
		var aTag= $(this).children('a');
		$(aTag).animate({paddingLeft:'14px'},100);
	},
	function(){
		var aTag= $(this).children('a');
		$(aTag).animate({paddingLeft:'6px'},150);
	});
	//End
});