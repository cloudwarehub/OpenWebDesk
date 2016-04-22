define(['jquery', 'owd/desktop', 'owd/appManager', 'owd/registry'], function($, desktop, appManager, _registry){
	desktop.init();
	_registry.init();
//	appManager.install('http://localhost:8081/baidu', function(){
//		appManager.run('baidu');
//	});
//	appManager.install('http://localhost:8081/about', function(){
//		appManager.run('about');
//	});
//	appManager.install('http://localhost:8081/gedit', function(app){
//		app.run();
//	});
});
require(['owd']);