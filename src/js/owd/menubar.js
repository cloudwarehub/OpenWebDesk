define(['owd/ui'], function(ui) {
	
	function init() {
		var mb = ui.createElement('owd-menubar');
		document.body.appendChild(mb);
		var desktop = ui.createElement('owd-desktop');
		document.body.appendChild(desktop);
	}
	return {
		init: init
	}
});