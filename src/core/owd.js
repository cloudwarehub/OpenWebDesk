define(['core/desktop', 'core/registry', 'core/appManager'], function(_desktop, _registry, _appManager){
	function run() {
		_desktop.init();
		_registry.init();
		_appManager.install('http://apps.cloudwarehub.com/about');
		// _appManager.install('http://localhost:8081/about');
		
		//_appManager.install('http://localhost:8081/gedit');
	}
		

	return {
		run: run
	};
});

require(['core/owd'], function(_owd) {
	_owd.run();
});