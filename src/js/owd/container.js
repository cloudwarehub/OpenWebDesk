define(function() {

	return {
		run: function(script) {
			/**
			 * must add \n at script end, in case script end line is comment
			 */
			var code = '(function(){' + script + "\n}).call(self)";
			var container = new Worker('worker.js');
			container.postMessage(code);
			return container;
		},
		stop: function(container) {
			container.terminate();
		}
	}
})