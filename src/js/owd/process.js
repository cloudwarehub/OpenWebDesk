define(function() {
	var proc_id = 1;
	function Process(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
	}
	
	Process.prototype = {
		getApp: function() {
			return this.app || null;
		}
	}
	
	function create(pid, opts) {
		var proc = new Process(opts);
		proc.pid = pid;
		return proc;
	}
	
	return {
		create: create
	};
});