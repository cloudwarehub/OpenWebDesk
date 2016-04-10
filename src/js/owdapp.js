function Owdapp(opts) {
	for (i in opts) {
		this[i] = opts[i];
	}
}
Owdapp.prototype = {
	createWindow: function(opts) {
		postMessage(['createWindow', opts]);
	},
	destroyWindow: function(opts) {
		postMessage(['destroyWindow', opts]);
	}
}