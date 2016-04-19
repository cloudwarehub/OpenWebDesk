define(['owd/window'], function(_window) {
	var windows = [];
	function getWindow(wid, cb) {
		for (i in windows) {
			if (windows[i].getWid() == wid) {
				(cb || function(){})(windows[i], i);
				return windows[i];
			}
		}
	}

	function destroyWindow(window) {
		getWindow(window.getWid(), function(win, i) {
			windows.splice(i, 1);
		});
	}

	return {
		getWindow: getWindow,
		createWindow: function(opts, app) {
			var window = _window.create(opts, app);
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
			getWindow(opts.wid, function(window, i) {
				window.destroy();
				windows.splice(i, 1);
			});
		},
		configureWindow: function(opts) {
			var window = getWindow(opts.wid);
			window.configure(opts);
		}
	};
})