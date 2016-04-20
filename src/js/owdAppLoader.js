self.Owdapp = {
	appInfo: {},
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

self.loadScripts = function() {
	for (i in arguments) {
		importScripts(self.Owdapp.appInfo.url + '/' + arguments[i]);
	}
}

onmessage = function(msg) {
	self.Owdapp.appInfo = msg.data;
	onmessage = null;
	loadScripts(main.js);
}
