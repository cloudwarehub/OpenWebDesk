define(['text!tpl/window.html', 'owd/ui', 'jquery', 'interact'], function(html, ui, $, Interact) {
	
	/**
	 * replace {{var}} with object value
	 */
	function render(template, data) {
		return template.replace(/\{{([a-zA-Z0-9_]+)\}}/g, function(t, c) {
			return eval("data." + c + "|| ''");
		});
	}
	var Window = function(opts) {
		for ( var i in opts) {
			this[i] = opts[i];
		}
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
		show: function() {
			$('body').append(render(html, this));
			Interact('#window_'+this.wid+' owd-window-title').draggable({
                onmove: dragMoveListener,
                onend: function (event) {
                    var buf = new ArrayBuffer(12);
                    var dv = new DataView(buf);
                    dv.setUint8(0, 10, true);
                    dv.setUint32(4, self.wid, true);
                    dv.setUint16(8, self.x + event.dx, true);
                    dv.setUint16(10, self.y + event.dy, true);
                    //ws.send(buf);
                }
            }).styleCursor(false);
            Interact('#window_'+this.wid).resizable({
                edges: { left: true, right: true, bottom: true, top: true }
            }).on('resizemove', function (event) {
                var target = event.target,
                x = (parseFloat(target.getAttribute('data-resize-x')) || 0),
                y = (parseFloat(target.getAttribute('data-resize-y')) || 0);
            
                // update the element's style
                target.style.width  = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                
                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                
                target.setAttribute('data-resize-x', x);
                target.setAttribute('data-resize-y', y);
            });
            function dragMoveListener (event) {
                //window.ws.send(JSON.stringify({cmd:'drag', data: {wid: self.wid, x: event.dx, y: event.dx}}));
                var target = event.target.parentNode.parentNode,
                    x = (parseFloat(target.style.left) || 0) + event.dx,
                    y = (parseFloat(target.style.top) || 0) + event.dy;
                
                target.style.left = x+'px';
                target.style.top = y+'px';
                
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