define(['owd/window'], function(Window) {
	return {
    	createWindow: function(opts) {
    		var window = new Window(opts);
    		window.show();
    	},
    };
})