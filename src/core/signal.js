define(['core/windowManager'], function(_wm) {
    return {
        handler: function(req, proc) {
            var e = req;
            switch (e.data.type) {
                case 'getAppInfo':
                    proc.container.reply(req, {url: proc.app.url, pid: proc.pid});
                    break;
                case 'createWindow':
                    var win = _wm.createWindow(e.data.data);
                    proc.container.reply(req, {
                        type: 'createWindowNotify',
                        data: {wid: win.getWid()}
                    });
                    break;
                case 'showWindow':
                    _wm.showWindow(e.data.data);
                    proc.container.reply(req, {
                        type: 'showWindowNotify'
                    });
                    break;
                case 'createShowWindow':
                    var win = _wm.createWindow(e.data.data);
                    proc.container.reply(req, {
                        type: 'createWindowNotify',
                        data: {wid: win.getWid()}
                    });
                    _wm.showWindow({wid: win.getWid()});
                    proc.container.reply(req, {
                        type: 'showWindowNotify',
                        data: {wid: win.getWid()}
                    });
                    break;
                case 'hideWindow':
                    _wm.hideWindow(e.data.data);
                    proc.container.reply(req, {});
                    break;
                case 'destroyWindow':
                    _wm.destroyWindow(e.data.data);
                    proc.container.reply(req, {});
                    break;
                case 'configureWindow':
                    _wm.configureWindow(e.data.data);
                    proc.container.reply(req, {});
                    break;
                case 'windowFrame':
                    var win = _wm.getWindow(e.data.data.wid);
                    if (win) {
                        win.getPlayer().decode(new Uint8Array(e.data.data.nal));
                    }
                    proc.container.reply(req, {});
                    break;
                case 'showLoading':
                    _wm.showLoading();
                    proc.container.reply(req, {});
                    break;
                case 'hideLoading':
                    _wm.hideLoading();
                    proc.container.reply(req, {});
                    break;
                default:
                    break;
            }
        }
    };
});