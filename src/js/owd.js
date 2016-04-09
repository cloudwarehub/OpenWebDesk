define(['owd/desktop', 'owd/appManager'], function(desktop, appManager){
	desktop.init();
	appManager.install('http://localhost:8080/apps/about', function(){
		appManager.run('about');
	});
});
require(['owd']);