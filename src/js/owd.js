define(['jquery', 'owd/desktop', 'owd/appManager', 'owd/registry'], function($, desktop, appManager, _registry){
	desktop.init();
	_registry.init();
	$("owd-menubar input").keyup(function(e) {
		var self = this;
		if (e.keyCode == 13) {
			appManager.install($(this).val(), function(app){
				//appManager.run(app);
			});
		}
	})
//	appManager.install('http://localhost:8081/baidu', function(){
//		appManager.run('baidu');
//	});
//	appManager.install('http://localhost:8081/about', function(){
//		appManager.run('about');
//	});
//	appManager.install('http://localhost:8081/gedit', function(){
//		appManager.run('gedit');
//	});
});
require(['owd']);