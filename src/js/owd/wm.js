define(['owd/window'], function(_window) {
	return {
    	createWindow: function(opts) {
    		var window = _window.create(opts);
    		window.show();
    	},
    };
})