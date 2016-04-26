define(['core/window'], function(_window) {
	var windows = [];
	var s_wid = 1;
	
	function getWindow(wid) {
		for (var i in windows) {
			if (windows[i].getWid() == wid) {
				return windows[i];
			}
		}
	}
	
	function createWindow(opts) {
		var window = _window.create(opts, proc);
		windows.push(window);
		return window;
	}

	function destroyWindow(window) {
		for (var i in windows) {
			if (windows[i].getWid() == window.wid) {
				windows[i].destroy();
				break;
			}
		}
		windows.splice(i, 1);
	}
	

	return {
		getWindow: getWindow,
		getWindows: function() {
			return windows;
		},
		createWindow: createWindow,
		showWindow: function(opts, proc) {
			var window = getWindow(opts.wid);
			if (opts.bare) {
				window.setBare(opts.bare);
			}

			window.show();
		},
		hideWindow: function(opts) {
			var window = getWindow(opts.wid);
			window.hide();
		},
		destroyWindow: destroyWindow,
		configureWindow: function(opts) {
			var window = getWindow(opts.wid);
			window.configure(opts);
		},
		showLoading: function() {
			$("owd-loading-mask").show();
		},
		hideLoading: function() {
			$("owd-loading-mask").hide();
		}
	};
});