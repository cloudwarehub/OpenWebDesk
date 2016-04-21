define(['owd/window'], function(_window) {
	var windows = [];
	function getWindow(wid, cb) {
		for (i in windows) {
			if (windows[i].getWid() == wid) {
				(cb || function() {
				})(windows[i], i);
				return windows[i];
			}
		}
	}

	function destroyWindow(window) {
		for (i in windows) {
			console.log(i);
			if (windows[i].getWid() == window.getWid()) {
				windows.splice(i, 1);
				return;
			}
		}
	}

	return {
		getWindow: getWindow,
		getWindows: function() {
			return windows;
		},
		createWindow: function(opts, proc) {
			var window = _window.create(opts, proc);
			windows.push(window);
			return window;
		},
		showWindow: function(opts) {
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
		destroyWindow: function(opts) {
			for (i in windows) {
				if (windows[i].getWid() == opt.wid) {
					windows[i].destroy();
					break;
				}
			}
			windows.splice(i, 1);
		},
		configureWindow: function(opts) {
			var window = getWindow(opts.wid);
			window.configure(opts);
		}
	};
})