define(['owd/ui'], function(ui) {
	
	function init() {
		var mb = ui.createElement('owd-menubar');
		document.body.appendChild(mb);
	}
	return {
		init: init
	}
});