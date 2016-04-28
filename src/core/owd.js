define(['core/desktop', 'core/registry', 'core/appManager'], function(_desktop, _registry, _appManager){
	function run() {
		_desktop.init();
		_registry.init();
		_appManager.install('http://apps.cloudwarehub.com/about');
	}
		

	return {
		run: run
	};
});

require(['core/owd'], function(_owd) {
	_owd.run();
});