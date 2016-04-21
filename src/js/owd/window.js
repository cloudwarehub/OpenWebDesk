define(['text!tpl/window.html', 'owd/ui', 'jquery', 'interact', 'Player', 'owd/helper', 'owd/wm'], function(html, ui, $, Interact, Player, _helper, _wm) {

	
	/**
	 * remove script tags
	 */
	function stripScripts(s) {
		var div = document.createElement('div');
		div.innerHTML = s;
		var scripts = div.getElementsByTagName('script');
		var i = scripts.length;
		while (i--) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
		return div.innerHTML;
	}

	var Window = function(opts, proc) {
		for (var i in opts) {
			this[i] = opts[i];
		}
		if (!opts.wid) {
			this.wid = Math.floor((Math.random() * 1000000) + 1); // TODO: check conflict
		}
		this.proc = proc;
		this.pid = proc.pid;
		this.player = new Player({
            size: {
                width: 1024,
                height: 768
            }
        });
	};
	Window.prototype = {
		getWid: function() {
			return this.wid;
		},
		getPlayer: function() {
			return this.player;
		},
		getDom: function() {
			return $('#window_' +this.proc.pid + '_'+ this.wid);
		},
		set: function(key, value) {
			this[key] = value;
		},
		setX: function(value) {
			this.x = value;
			if (this.getDom().length) {
				this.getDom().css('left', this.x);
			}
			return this;
		},
		setY: function(value) {
			this.y = value;
			var y = this.y;
			if (this.getDom().length) {
				var __y = this.bare ? y : y - 30;
				this.getDom().css('top', __y);
			}
			return this;
		},
        setWidth: function(value){
            this.width = value;
            if(this.getDom().length){
                this.getDom().css('width', this.width);
                this.getDom().find("canvas").css('width', this.width);
            }
        },
        setHeight: function(value){
            this.height = value;
            if(this.getDom().length){
                this.getDom().css('height', this.bare?this.height:this.height+30);
                //this.getDom().find("canvas").css('height', this.height);
            }
        },
		setBare: function(value) {
			this.bare = value;
			return this;
		},
		maximize: function(){
            this.getDom().css('left', 0).css('top', 0).width($(document).width()).height($(document).height()).css('transform', '');
            // $("#window_"+this.wid+' canvas').get(0).getContext('2d').canvas.width = $(document).width();
            // $("#window_"+this.wid+' canvas').get(0).getContext('2d').canvas.height = $(document).height();
            
            //drag to (0, 30)
            var buf = new ArrayBuffer(12);
            var dv = new DataView(buf);
            dv.setUint8(0, 10, true);
            dv.setUint32(4, this.wid, true);
            dv.setInt16(8, 0, true);
            dv.setInt16(10, 30, true);
            //window.ws.send(buf);
            
            //change size
            var buf = new ArrayBuffer(12);
            var dv = new DataView(buf);
            dv.setUint8(0, 11, true);
            dv.setUint32(4, this.wid, true);
            dv.setUint16(8, $(document).width(), true);
            dv.setUint16(10, $(document).height(), true);
            //window.ws.send(buf);
        },
        hide: function(){
            this.getDom().hide();
        },
        destroy: function(){
        	this.getDom().remove();
        	//_wm.destroyWindow(this);
        	(this.onDestroy || function(){})(this);
        },
        configure: function(opts) {
        	this.setX(opts.x);
            this.setY(opts.y);
            this.setWidth(opts.width);
            this.setHeight(opts.height);
            //$("#window_"+opts.wid).width(opts.width).height(ht); 
            //$("#window_"+opts.wid+" canvas").remove();
            //$("#window_"+opts.wid+' owd-window-content').append('<canvas width="'+opts.width+'px" height="'+opts.height+'px"></canvas>');
        },
		show: function() {
			if(this.getDom().length != 0) {
				this.getDom().show();
                return;
            }
			var self = this;
			
			if (!this.bare && this.y < 15) {
                self.proc.container.worker.postMessage(['windowMove', {wid: this.wid, x: this.x, y: 30}]);
			}
			this.top_show = this.bare?'none':'block';
			$('owd-desktop').append(_helper.render(html, this));
			if (this.contentTpl) {
				$.get(_helper.join(this.proc.app.getUrl(), this.contentTpl), function(tpl) {
					self.getDom().find('owd-window-content').html(_helper.render(stripScripts(tpl), self))
				});
			}
			if (this.type == 'cloudware') {
				self.getDom().find('owd-window-content').html(this.player.canvas);
			}
			self.getDom().find('owd-window-button-maximize').click(function(){
                self.maximize();
            });
			self.getDom().find('owd-window-button-close').click(function(){
                self.hide();
            });
			Interact('#window_' + this.proc.pid + '_' + this.wid + ' owd-window-title').draggable({
				onmove: dragMoveListener,
				onend: function(event) {
					self.proc.container.worker.postMessage(['windowMove', {wid: self.wid, x: self.x + event.dx, y: self.y + event.dy}]);
				}
			}).styleCursor(false);
			Interact('#window_' + this.proc.pid + '_' + this.wid).resizable({
				edges: {
					left: true,
					right: true,
					bottom: true,
					top: true
				}
			}).on('resizemove', function(event) {
				var target = event.target, x = (parseFloat(target.getAttribute('data-resize-x')) || 0), y = (parseFloat(target.getAttribute('data-resize-y')) || 0);

				// update the element's style
				target.style.width = event.rect.width + 'px';
				target.style.height = event.rect.height + 'px';

				// translate when resizing from top or left edges
				x += event.deltaRect.left;
				y += event.deltaRect.top;

				target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

				target.setAttribute('data-resize-x', x);
				target.setAttribute('data-resize-y', y);
			});
			function dragMoveListener(event) {
				// window.ws.send(JSON.stringify({cmd:'drag', data: {wid:
				// self.wid, x: event.dx, y: event.dx}}));
				var target = event.target.parentNode.parentNode, x = (parseFloat(target.style.left) || 0) + event.dx, y = (parseFloat(target.style.top) || 0) + event.dy;

				target.style.left = x + 'px';
				target.style.top = y + 'px';

				// update the posiion attributes
				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
			}
			$('#window_' + this.proc.pid + '_' + this.wid +' canvas').mousemove(function(e){
                var buf = new ArrayBuffer(12);
                var dv = new DataView(buf);
                dv.setUint8(0, 4, true);
                dv.setUint32(4, self.wid, true);
                dv.setInt16(8, e.offsetX, true);
                dv.setInt16(10, e.offsetY, true);
                //window.ws.send(buf)
                //window.ws.send(JSON.stringify({cmd:'mousemove', data: {wid: self.wid, x: e.offsetX, y: e.offsetY}}));
                self.proc.container.worker.postMessage(['mousemove', {wid: self.wid, x: e.offsetX, y: e.offsetY}]);
            });
            $('#window_' + this.proc.pid + '_' + this.wid +' canvas').mousedown(function(e){
                var buf = new ArrayBuffer(12);
                var dv = new DataView(buf);
                dv.setUint8(0, 5, true);
                dv.setUint32(4, self.wid, true);
                dv.setUint32(8, self.wid, true);
                dv.setInt16(8, e.which, true);
                //window.ws.send(buf)
                self.proc.container.worker.postMessage(['mousedown', {wid: self.wid, code: e.which}]);
            	return false;
            });
            $('#window_' + this.proc.pid + '_' + this.wid +' canvas').mouseup(function(e){
                var buf = new ArrayBuffer(12);
                var dv = new DataView(buf);
                dv.setUint8(0, 6, true);
                dv.setUint32(4, self.wid, true);
                dv.setUint32(8, self.wid, true);
                dv.setInt16(8, e.which, true);
                //window.ws.send(buf)
                self.proc.container.worker.postMessage(['mouseup', {wid: self.wid, code: e.which}]);
            	return false;
            });
		}
	}

	function create(opts, proc) {
		var w = new Window(opts, proc);
		return w;
	}
	return {
		create: create
	}
});