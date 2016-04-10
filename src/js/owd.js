define(['owd/desktop', 'owd/appManager'], function(desktop, appManager){
	desktop.init();
	appManager.install('http://localhost:8081/about', function(){
		appManager.run('about');
	});
});
require(['owd']);