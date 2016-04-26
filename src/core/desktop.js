define(['jquery', 'text!tpl/owdapp_item.html', 'core/helper', 'core/appManager', 'core/desktop'], function($, _owdapp_item, _helper, _appManager) {
	var isFullscreen = 0;
	
	function setupTimeView() {
		var t = setInterval(time, 1000);
		function time() {
			var m = new Date();
			var dateString = m.getFullYear() + "/" + ("0" + (m.getMonth() + 1)).slice(-2) + "/" + ("0" + m.getDate()).slice(-2);
			var timeString = ("0" + m.getHours()).slice(-2) + ":" + ("0" + m.getMinutes()).slice(-2) + ":" + ("0" + m.getSeconds()).slice(-2);
			$("owd-menubar time").html(timeString).attr('title', dateString);
		}
	}
	function open(){
		_appManager.install($(this).attr('owdapp-url'), function(app){
			$('owd-menubar search box').hide();
			app.run();
		});
	}
	
	function open1(){
		_appManager.install($(this).attr('owdapp-url'), function(app){
			$('owd-menubar search box').hide();
			app.run();
		});
	}
	
	function setupSearchView() {
		$.ajax({
			url: 'http://api.cloudwarehub.com/owdapp/search',
			dataType: 'json',
			success: function(data) {
				$('owd-menubar owdapps').html('');
				for (var i in data.data) {
					var str = _helper.render(_owdapp_item, data.data[i]);
					$('owd-menubar owdapps').append(str);
					$('owd-menubar owdapp[owdapp-id="'+data.data[i].id+'"] a').click(open);
				}
			}
		});
		
		$("owd-menubar search icon").click(function() {
			$("owd-menubar search box").toggle();
		});
		
		$(document).click(function(event) { 
			if(!$(event.target).closest('owd-menubar search').length ) {
				$('owd-menubar search box').hide();
			}
		});
		$("owd-menubar search input").on('input', function() {
			var key = $(this).val();
			if (key === "") 
				return;
			$.ajax({
				url: 'http://api.cloudwarehub.com/owdapp/search',
				data: {key: key},
				dataType: 'json',
				success: function(data) {
					$('owd-menubar owdapps').html('');
					for (var i in data.data) {
						var str = _helper.render(_owdapp_item, data.data[i]);
						$("owd-menubar owdapps").append(str);
						$('owd-menubar owdapp[owdapp-id="'+data.data[i].id+'"] a').click();
					}
				}
			});
		});
	}
	
	function initMenubar() {
		setupTimeView();
		setupSearchView();
		$('owd-menubar fullscreen').click(toggleFullscreen);
	}

	function toggleFullscreen() {
		if (isFullscreen) {
			if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			}
			isFullscreen = 0;
		} else {
			var docElm = document.documentElement;
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			} else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
			isFullscreen = 1;
		}
	}
	
	function init() {
		initMenubar();
	}

	return {
		init: init,
		toggleFullscreen: toggleFullscreen
	};
});