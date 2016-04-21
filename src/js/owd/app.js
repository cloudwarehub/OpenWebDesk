define(['owd/appManager', 'owd/registry', 'owd/process', 'owd/signal', 'owd/container', 'owd/processManager', 'owd/keyMapper'], 
		function(appManager, registry, _process, _signal, _container, _processManager, KeyMapper) {
	function App(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
	}
	
	App.prototype = {
		run: function() {
			var self = this;
			$.ajax({
				url: '/owdAppLoader.js',
				dataType: "text",
				success: function(script) {
					var container = _container.run(script)
					var proc = _processManager.create(null, {
						app: self,
						container: container
					});
					container.worker.postMessage({url: self.url});
					container.worker.onmessage = function(msg) {
						_signal.handler(msg, proc);
					}
					var km = new KeyMapper(8);
				    var downkeys = [];
					$(document).keyup(function(e) {
						var code = e.which;
						container.worker.postMessage(['keyup', {wid: 0, code: km.mapKey(code)}]);
						return false;
					});
					$(document).keydown(function(e) {
						var code = e.which;
						container.worker.postMessage(['keydown', {wid: 0, code: km.mapKey(code)}]);
						return false;
					});
				}
			});
		},
		getId: function() {
			return this.id;
		},
		getUrl: function() {
			return this.url;
		},
		getConfig: function() {
			return this.config
		}
	}
	
	function create(opts) {
		var app = new App(opts);
		return app;
	}
	
	return {
		create: create
	}
});