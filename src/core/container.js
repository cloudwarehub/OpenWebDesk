define(function() {

	function Container(script) {
		/**
		 * must add \n at script end, in case script end line is comment
		 */
		var code = '(function(){' + script + "\n}).call(self)";
		this.worker = new Worker('worker.js');
		this.worker.postMessage(code);
	}
	
	Container.prototype = {
		stop: function() {
			this.worker.terminate();
		},
		reply: function(req, data) {
            this.worker.postMessage({data: data, seq: req.seq});
        }
	};
	
	return {
		run: function(script) {
			var container = new Container(script);
			return container;
		}
	};
});