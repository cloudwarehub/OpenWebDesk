define(['owd/desktop', 'owd/appManager'], function(desktop, appManager){
	desktop.init();
	appManager.install('http://localhost:8081/baidu', function(){
		appManager.run('baidu');
	});
	appManager.install('http://localhost:8081/about', function(){
		appManager.run('about');
	});
	appManager.install('http://localhost:8081/gedit', function(){
		appManager.run('gedit');
	});
});
require(['owd']);