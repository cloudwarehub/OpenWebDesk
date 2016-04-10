define(function() {

	return {
		run: function(script) {
			/**
			 * must add \n at script end, in case script end line is comment
			 */
			var code = '(function(){' + script + "\n}).call(self)";
			var worker = new Worker('worker.js');
			worker.postMessage(code);
			return worker;
		}
	}
})