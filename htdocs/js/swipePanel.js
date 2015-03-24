(function($) {
    window.addEventListener('touchmove',function(event){event.preventDefault()},false);
    $.fn.swipePanel = function(options) {
        var _self = $(this);
        var defaults = {
            animateOver:function(){
                console.log('animateOver');
            }
        };
        var opts = $.extend({},
            defaults, options);
        var dom = {
            navitem: _self.find('.swipePanel-nav-item'),
            hi: _self.find('.swipePanel-hitem'),
            vi:null
        }
        var paramGroup = {
            pX: 0,
            pY: 0,
            curX: 0,
            curY: 0,
            active: null,
            related: null,
            isAnimating: false,
            isStart:false
        }
        dom.navitem.each(function(index){
            if(paramGroup.curX == index){
                $(this).addClass('active');
            }
        });
        dom.navitem.click(function(){
            if(!paramGroup.isAnimating){
                var t = $(this);
                //alert(t.attr('cid'));
                var newX = dom.navitem.index(t);
                var d1 = 500;
                var d2 = 600;
                if(paramGroup.curX != newX){
                    paramGroup.isAnimating = true;
                    dom.hi.eq(newX).css({
                        left:'100%'
                    });
                    dom.hi.eq(newX).animate({
                        left:0
                    },d1);
                    dom.hi.eq(paramGroup.curX).animate({
                        left:'-100%'
                    },d2,function(){
                        paramGroup.isAnimating = false;
                    });
                    paramGroup.curX = newX;
                    paramGroup.curY = dom.hi.eq(paramGroup.curX).find('.swipePanel-vitem').index(dom.hi.eq(paramGroup.curX).find('.active'));
                    dom.navitem.removeClass('active');
                    dom.navitem.eq(paramGroup.curX).addClass('active');
                }
            }
        });
        _self.css({
            width: $(window).width(),
            height: $(window).height()
        });
        _self.hammer({
            threshold: 10,
        }).bind('panleft panright panup pandown panend panstart',
            function(ev) {
                _handler(ev);
            });
        dom.hi.each(function(index) {
            if (paramGroup.curX != index) {
                $(this).css({
                    left: '100%'
                });
            }
            $(this).find('.swipePanel-vitem').each(function(vindex) {
                if (paramGroup.curY != vindex) {
                    $(this).css({
                        top: '100%'
                    });
                }else{
                    $(this).addClass('active');
                }
            });
        });
        function _handler(ev) {
            if(!paramGroup.isAnimating){
                if (ev.type == 'panstart') {
                    paramGroup.dire = ev.gesture.offsetDirection;
                    paramGroup.isStart = true;
                } else if (ev.type == 'panend') {
                    if (paramGroup.dire == 2 || paramGroup.dire == 4) {
                        _hMoveEnd();
                    } else {
                        _vMoveEnd();
                    }
                } else {
                    if(paramGroup.isStart){
                        if (paramGroup.dire == 2 || paramGroup.dire == 4) {
                            if (paramGroup.dire == 2) {
                                if(ev.gesture.direction == 4){
                                    _hMove('right');
                                }
                            } else {
                                if(ev.gesture.direction == 2){
                                    _hMove('left');
                                }
                            }
                        } else {
                            if (paramGroup.dire == 8) {
                                if(ev.gesture.direction == 16){
                                    _vMove('down');
                                }
                            }else{
                                if(ev.gesture.direction == 8){
                                    _vMove('up');
                                }
                            }
                        }
                    }
                }
            }
        }
        function _hMove(dire) {
            var l = 3;//滑动距离控制
            dom.active = dom.hi.eq(paramGroup.curX);
            if (dire == 'left') {
                if (dom.active.next('.swipePanel-hitem').size()) {
                    dom.related = dom.active.next();
                } else {
                    dom.related = dom.hi.eq(0);
                }
                if (paramGroup.pX == 0) {
                    dom.related.css({
                        left: '100%'
                    });
                }
                paramGroup.pX--;
                dom.active.css({
                    left: paramGroup.pX * l + '%'
                });
                dom.related.css({
                    left: 100 + paramGroup.pX * l + '%'
                });
            } else {
                if (dom.active.prev('.swipePanel-hitem').size()) {
                    dom.related = dom.active.prev();
                } else {
                    dom.related = dom.hi.eq(dom.hi.size() - 1);
                }
                if (paramGroup.pX == 0) {
                    dom.related.css({
                        left: '-100%'
                    });
                }
                paramGroup.pX++;
                dom.active.css({
                    left: paramGroup.pX * l + '%'
                });
                dom.related.css({
                    left: -100 + paramGroup.pX * l + '%'
                });
            }
        }
        function _hMoveEnd() {
            var r = 2;//切换阀值
            var d1 = 500;
            var d2 = 600;
            if (paramGroup.pX != 0) {
                if(!paramGroup.isAnimating){
                    paramGroup.isAnimating = true;
                }
                if (paramGroup.pX >= r) {
                    dom.active.animate({
                        left: '100%'
                    });
                    dom.related.animate({
                        left: 0
                    },function(){
                        paramGroup.isAnimating = false;
                        opts.animateOver.apply(this);
                    });
                    paramGroup.curX--;
                    paramGroup.curY = dom.related.find('.swipePanel-vitem').index(dom.related.find('.active'));
                    if (paramGroup.curX == -1) {
                        paramGroup.curX = dom.hi.size() - 1;
                    }
                    dom.navitem.removeClass('active');
                    dom.navitem.eq(paramGroup.curX).addClass('active');
                }else{
                    if (paramGroup.pX <= -r) {
                        dom.active.animate({
                            left: '-100%'
                        },d2,function(){
                            paramGroup.isAnimating = false;
                            opts.animateOver.apply(this);
                        });
                        dom.related.animate({
                            left: 0
                        },d1);
                        paramGroup.curX++;
                        paramGroup.curY = dom.related.find('.swipePanel-vitem').index(dom.related.find('.active'));
                        if (paramGroup.curX == dom.hi.size()) {
                            paramGroup.curX = 0;
                        }
                        dom.navitem.removeClass('active');
                        dom.navitem.eq(paramGroup.curX).addClass('active');
                    }else{
                        dom.active.animate({
                            left: 0
                        },d2,function(){
                            paramGroup.isAnimating = false;
                        });
                        if(paramGroup.pX>0){
                            dom.related.animate({
                                left: '-100%'
                            },d1);
                        }else{
                            dom.related.animate({
                                left: '100%'
                            },d1);
                        }
                    }
                }
                paramGroup.pX = 0;
            }
            paramGroup.isStart = false;
        }
        function _vMove(dire) {
            var l = 3;//滑动距离控制
            dom.vi = dom.hi.eq(paramGroup.curX).find('.swipePanel-vitem');
            dom.active = dom.vi.eq(paramGroup.curY);
            if (dire == 'up') {
                if (dom.active.next('.swipePanel-vitem').size()) {
                    dom.related = dom.active.next();
                } else {
                    dom.related = dom.vi.eq(0);
                }
                if (paramGroup.pY == 0) {
                    dom.related.css({
                        top: '100%'
                    });
                }
                paramGroup.pY--;
                dom.active.css({
                    top: paramGroup.pY * l + '%'
                });
                dom.related.css({
                    top: 100 + paramGroup.pY * l + '%'
                });
            } else {
                if (dom.active.prev('.swipePanel-vitem').size()) {
                    dom.related = dom.active.prev();
                } else {
                    dom.related = dom.vi.eq(dom.vi.size() - 1);
                }
                if (paramGroup.pY == 0) {
                    dom.related.css({
                        top: '-100%'
                    });
                }
                paramGroup.pY++;
                dom.active.css({
                    top: paramGroup.pY * l + '%'
                });
                dom.related.css({
                    top: -100 + paramGroup.pY * l + '%'
                });
            }
        }
        function _vMoveEnd() {
            var r = 2;//切换阀值
            var d1 = 500;
            var d2 = 600;
            if (paramGroup.pY != 0) {
                if(!paramGroup.isAnimating){
                    paramGroup.isAnimating = true;
                }
                if (paramGroup.pY >= r) {
                    dom.active.animate({
                        top: '100%'
                    });
                    dom.related.animate({
                        top: 0
                    },function(){
                        paramGroup.isAnimating = false;
                        opts.animateOver.apply(this);
                    });
                    paramGroup.curY--;
                    if (paramGroup.curY == -1) {
                        paramGroup.curY = dom.vi.size() - 1;
                    }
                    dom.vi.removeClass('active');
                    dom.vi.eq(paramGroup.curY).addClass('active');
                }else{
                    if (paramGroup.pY <= -r) {
                        dom.active.animate({
                            top: '-100%'
                        },d2,function(){
                            paramGroup.isAnimating = false;
                            opts.animateOver.apply(this);
                        });
                        dom.related.animate({
                            top: 0
                        },d1);
                        paramGroup.curY++;
                        if (paramGroup.curY == dom.vi.size()) {
                            paramGroup.curY = 0;
                        }
                        dom.vi.removeClass('active');
                        dom.vi.eq(paramGroup.curY).addClass('active');
                    }else{
                        dom.active.animate({
                            top: 0
                        },d2,function(){
                            paramGroup.isAnimating = false;
                        });
                        if(paramGroup.pY>0){
                            dom.related.animate({
                                top: '-100%'
                            },d1);
                        }else{
                            dom.related.animate({
                                top: '100%'
                            },d1);
                        }
                    }
                }
                paramGroup.pY = 0;
            }
            paramGroup.isStart = false;
        }
    }
})(jQuery);