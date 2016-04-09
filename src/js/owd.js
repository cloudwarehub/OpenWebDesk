define(['owd/desktop', 'owd/appManager', 'owd/wm'], function(desktop, appManager){
	desktop.init();
	appManager.install('http://localhost:8080/apps/about', function(){
		appManager.run('about');
	});
});
require(['owd']);