define(['jquery', 'core/container', 'core/processManager', 'core/signal'], function($, _container, _processManager, _signal) {
	function launch(app) {
		var self = this;
		$.ajax({
			url: '/owdAppLoader.js',
			dataType: "text",
			success: function(script) {
				var container = _container.run(script);
				var proc = _processManager.create({
					app: app,
					container: container
				});
				container.worker.postMessage({url: app.url});
				container.worker.onmessage = function(msg) {
					_signal.handler(msg, proc);
				};
			}
		});
	}
	
	return {
		launch: launch
	};
});