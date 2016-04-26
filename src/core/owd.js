define(['core/desktop', 'core/registry', 'core/appManager'], function(_desktop, _registry, _appManager){
	function run() {
		_desktop.init();
		_registry.init();
	}
		
	//appManager.install('http://localhost:8081/about');
//	appManager.install('http://localhost:8081/baidu', function(){
//		appManager.run('baidu');
//	});

//	appManager.install('http://localhost:8081/gedit', function(app){
//		app.run();
//	});
	return {
		run: run
	};
});

require(['core/owd'], function(_owd) {
	_owd.run();
});