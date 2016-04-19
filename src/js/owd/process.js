define(function() {
	var proc_id = 1;
	function Process(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}
		this.proc_id = proc_id++;
	}
	
	function create(opts) {
		var proc = new Process(opts);
		return proc;
	}
	
	return {
		create: create
	};
});