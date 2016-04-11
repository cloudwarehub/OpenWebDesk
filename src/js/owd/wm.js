define(['owd/window'], function(_window) {
	var windows = [];
	function getWindow(wid, cb) {
		for(var i in windows){
            if(windows[i].getWid() == wid){
            	if (cb) {
					cb(windows[i], i);
				}
                return windows[i];
            }
        }
	}
	
	return {
		getWindow: getWindow,
    	createWindow: function(opts) {
    		var window = _window.create(opts);
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
			
			windows.splice
		}
    };
})