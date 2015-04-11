// JavaScript Document
var app = app || {};
app.menuType = {icon:"icon", text:"txet", iconText:"icon_text"};
app.menu = function(){
	var m = this;
	this.isShown = false;
	var container = null;
	var menuWidth = 128;
	var menuHeight = 32;
	var textWidth = 96;
	var textHeight = 32;
	var iconWidth = 32;
	var iconHeight = 32;
	var init = function(){
			if(!!!container) {
				container = document.createElement("ul");
				container.id = "app-menu";
				container.style.margin = "0px 0px 0px 0px";
				container.style.padding = "0px 0px 0px 0px";
				container.style.height = menuHeight + "px";
				//container.style.border = "1px solid rgba(211, 203, 203, 1)";
				container.style.width = menuWidth + "px";
				container.style.right = "0px";
				container.style.top = "0px";
				container.style.visibility = "hidden";
				container.style.display = "none";
				container.style.position = "fixed";
				container.style.zIndex = "9";
				container.className = "nav";
				/*for (var i = 0; i < 8; i++){
					var menuItem = document.createElement("div");
					menuItem.style.width = (window.innerWidth / 8)+"px";
					menuItem.style.height = menuItemHeight + "px";
					menuItem.id = menuItemMap[i];
					menuItem.style.textAlign = "center";
					menuItem.style.float = "left";
					menuItem.style.margin = "0px 0px";
					menuItem.style.padding = "0px 0px";
					if(i == 7){
						menuItem.style.backgroundImage = "url(../image/right.png)";
						menuItem.style.backgroundRepeat= "no-repeat";
						menuItem.style.backgroundPositionX = ((window.innerWidth / 8) - 12) + "px";
					}
					var menuItemButton = document.createElement("img");
					menuItemButton.style.width = menuItemButtonWidth + "px";
					menuItemButton.style.height = menuItemButtonHeight + "px";
					menuItemButton.src = menuItemButtonBgMap[i];
					menuItemButton.id = menuItemButtonMap[i];
					menuItem.appendChild(menuItemButton);
					container.appendChild(menuItem);
				}*/
				document.body.appendChild(container);
			}
			
		};
	var getMenu = function(){
			if(!!!container)
				init();
			container = document.getElementById("app-menu");
			return container;
	};
	this.type = {
		         text:function(){onlyTxet = true; onlyIcon = false; iconText= false; return m;}, 
	             icon:function(){onlyTxet = false; onlyIcon = true; iconText= false; return m;}, 
	             iconText:function(){onlyTxet = false; onlyIcon = false; iconText= true; return m;}
				};
	this.show = function(){
		getMenu().style.display = "block";
		getMenu().style.visibility = "visible";
		m.isShown = true;
		return m;
	};
	this.hide = function(){
		getMenu().style.display = "none";
		getMenu().style.visibility = "hidden";	
		m.isShown = false;
		return m;
	};
	var belongWidthContainer = null;
	this.setBelongWidthContainer = function(belongWidthId){
		belongWidthContainer = document.getElementById(belongWidthId);
		return m;
	};

	this.resetPosition = function(){
		if(!!!belongWidthContainer) {
			console.error("please set menu belong with container for the method x.setBelongWidthContainer(ElementId). ");
			return;
		}
        getMenu().style.top = belongWidthContainer.style.top;
        var blwithCtnerWidth = belongWidthContainer.style.width.indexOf("%")>0 ? (parseFloat(belongWidthContainer.style.width.split("%")[0])/100 * window.innerWidth) : parseInt(belongWidthContainer.style.width);
        getMenu().style.right = (parseInt(belongWidthContainer.style.right) + blwithCtnerWidth)+"px";
		return m;
	};
	/*
	 * icon_text: 
	 * [
	 * {name:"xxx", id:"xxx", icon:"xxxx", text: "", icon_text: {icon:"xxxx", text: ""}, href:"xxx", method:function(...){....}},
	 * {name:"xxx", id:"xxx", icon:"xxxx", text: "", icon_text: {icon:"xxxx", text: ""}, href:"xxx", method:function(...){....}},
	 * {name:"xxx", id:"xxx", icon:"xxxx", text: "", icon_text: {icon:"xxxx", text: ""}, href:"xxx", method:function(...){....}},
	 * ......
	 * ];
	 * 
	 */
	this.setItems = function(icon_text, menuType){
		if(undefined != icon_text && undefined != menuType) {

		} else {
			console.error("please set show type for the application menu.");
		}
		if(null != icon_text) {
			var mLength = icon_text.length;
			for( var i = 0; i < mLength; i++) {
				var menu = icon_text[i];
				var menuItem = document.createElement("li");
				menuItem.style.paddingRight = "8px";
				if(null != menu.name && undefined != menu.name) {
					menuItem.name = menu.name;
				}
				if(null != menu.id && undefined != menu.id) {
					menuItem.id = menu.id;
				}
				if(null != menu.text && undefined != menu.text ) {
					var a = document.createElement("a");
					if(null != menu.href && undefined != menu.href)
						a.href = menu.href;
					else
						a.href = "#";
					a.innerHTML = menu.text;
					menuItem.appendChild(a);
				}
				if(null != menu.icon && undefined != menu.icon) {
                     var iconFrame = document.createElement("span");
                     var icon = document.createElement("img");
                     icon.href = menu.icon;
                     iconFrame.appendChild(icon);
                     menuItem.appendChild(iconFrame);
			    }

			    getMenu().appendChild(menuItem);
			}					
		}

    	return m;
	};
	this.addItem = function(icon_text, menuType, index){
		if(undefined != icon_text && undefined != menuType) {

		} else {
			console.error("please set show type for the application menu.");
		}
		 
		return m;
	};

	this.removeItem = function(item_index){
		return m;
	};

	return m;

};
window.appMenu = new app.menu();
