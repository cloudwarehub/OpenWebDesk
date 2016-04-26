define(['core/windowManager'], function(_wm) {
	return {
		handler: function(e, proc) {
			var win;
			switch (e.data[0]) {
			case 'createApp':
				//apps.push(e.data[1]);
				break;
			case 'createWindow':
				_wm.createWindow(e.data[1], proc);
				break;
			case 'showWindow':
				_wm.showWindow(e.data[1]);
				break;
			case 'createShowWindow':
				win = _wm.createWindow(e.data[1], proc);
				_wm.showWindow({wid: win.getWid()});
				break;
			case 'hideWindow':
				_wm.hideWindow(e.data[1]);
				break;
			case 'destroyWindow':
				_wm.destroyWindow(e.data[1]);
				break;
			case 'configureWindow':
				_wm.configureWindow(e.data[1]);
				break;
			case 'windowFrame':
				win = _wm.getWindow(e.data[1].wid);
				if(win)
					win.getPlayer().decode(new Uint8Array(e.data[1].nal));
				break;
			case 'showLoading':
				_wm.showLoading();
				break;
			case 'hideLoading':
				_wm.hideLoading();
				break;
			default:
				break;
			}
		}
	};
});