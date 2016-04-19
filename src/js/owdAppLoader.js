function Owdapp(opts) {
	var apps = [];
	for (i in opts) {
		this[i] = opts[i];
	}
	postMessage(['createApp', this]);
}
Owdapp.prototype = {
	createWindow: function(opts) {
		postMessage(['createWindow', opts]);
	},
	createShowWindow: function(opts) {
		postMessage(['createShowWindow', opts]);
	},
	destroyWindow: function(opts) {
		postMessage(['destroyWindow', opts]);
	}
}
self.Owdapp = Owdapp;
self.appInfo = null;
self.loadScripts = function(s) {
	importScripts(self.appInfo.url + '/' + s);
}
onmessage = function(msg) {
	console.log(msg.data)
	self.appInfo = msg.data;
	onmessage = null;
	importScripts(self.appInfo.url + '/' + 'main.js');
}
