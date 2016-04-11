define(['text!tpl/window.html', 'owd/ui', 'jquery', 'interact', 'Player'], function(html, ui, $, Interact, Player) {

	/**
	 * replace {{var}} with object value
	 */
	function render(template, data) {
		return template.replace(/\{{([a-zA-Z0-9_]+)\}}/g, function(t, c) {
			return eval("data." + c + "|| ''");
		});
	}
	
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

	var Window = function(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
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
			return $('#window_' + this.wid);
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
			var y = this.or ? this.y : this.y - 30;
			if (this.getDom().length) {
				this.getDom().css('top', y);
			}
			return this;
		},
		setWidth: function(value) {
			this.width = value;
			return this;
		},
		setHeight: function(value) {
			this.height = value;
			return this;
		},
		setBare: function(value) {
			this.bare = value;
			return this;
		},
		maximize: function(){
            $("#window_"+this.wid).css('left', 0).css('top', 0).width($(document).width()).height($(document).height());
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
            $("#window_"+this.wid).hide();
        },
        destroy: function(){
        	$("#window_"+this.wid).remove();
            //window.ws.send(JSON.stringify({cmd:'destroy', data: {wid: this.wid}}));
        },
		show: function() {
			var self = this;
			$('owd-desktop').append(render(html, this));
			if (this.contentTpl) {
				$.get(this.contentTpl, function(tpl) {
					$("#window_" + self.wid + ' owd-window-content').html(render(stripScripts(tpl), self))
				});
			}
			if (this.type == 'cloudware') {
				$("#window_"+this.wid+' owd-window-content').html(this.player.canvas);
			}
			$('#window_'+this.wid+' owd-window-button-maximize').click(function(){
                self.maximize();
            });
			Interact('#window_' + this.wid + ' owd-window-title').draggable({
				onmove: dragMoveListener,
				onend: function(event) {
					var buf = new ArrayBuffer(12);
					var dv = new DataView(buf);
					dv.setUint8(0, 10, true);
					dv.setUint32(4, self.wid, true);
					dv.setUint16(8, self.x + event.dx, true);
					dv.setUint16(10, self.y + event.dy, true);
					// ws.send(buf);
				}
			}).styleCursor(false);
			Interact('#window_' + this.wid).resizable({
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
		}
	}

	function create(opts) {
		var w = new Window(opts);
		return w;
	}
	return {
		create: create
	}
});