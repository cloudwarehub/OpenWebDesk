define(['owd/appManager', 'owd/registry'], function(appManager, registry) {
	function App(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
		this.name = "";
		this.run = function() {
			console.log(this.name + 'run not defined');
		};
	}
	
	App.prototype = {
		run: function() {
			console.log('run it')
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