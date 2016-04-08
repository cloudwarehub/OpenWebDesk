define(['text!tpl/window.html', 'owd/ui', 'jquery'], function(html, ui, $) {
	var Window = function(opts) {
		for ( var i in opts) {
			this[i] = opts[i];
		}
		console.log($('body'));
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
			$('body').append(html);
		}
	}
	return Window;
});