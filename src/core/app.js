define(['core/launcher', 'core/registry', 'core/process', 'core/signal', 'core/container', 'core/processManager'], 
		function(_launcher, registry, _process, _signal, _container, _processManager) {
	function App(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
	}
	
	App.prototype = {
		run: function() {
			_launcher.launch(this);
		},
		getId: function() {
			return this.id;
		},
		getUrl: function() {
			return this.url;
		},
		getConfig: function() {
			return this.config;
		}
	};
	
	function create(opts) {
		var app = new App(opts);
		return app;
	}
	
	return {
		create: create
	};
});