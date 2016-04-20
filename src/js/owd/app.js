define(['owd/appManager', 'owd/registry', 'owd/process', 'owd/signal', 'owd/container', 'owd/processManager'], 
		function(appManager, registry, _process, _signal, _container, _processManager) {
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