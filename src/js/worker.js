self.onmessage = function(e) {
	self.onmessage = null; // Clean-up
	eval(e.data);
};