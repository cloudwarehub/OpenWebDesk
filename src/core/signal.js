define(['core/windowManager'], function(_wm) {
    return {
        handler: function(e, proc) {
            switch (e.data.type) {
                case 'createApp':
                    //apps.push(e.data[1]);
                    break;
                case 'createWindow':
                    var win = _wm.createWindow(e.data.data);
                    proc.container.worker.postMessage({
                        type: 'createWindowNotify',
                        data: {wid: win.getWid()},
                        seq: e.data.seq
                    });
                    break;
                case 'showWindow':
                    _wm.showWindow(e.data.data);
                    break;
                case 'createShowWindow':
                    var win = _wm.createWindow(e.data.data);
                    proc.container.worker.postMessage({
                        type: 'createWindowNotify',
                        data: {wid: win.getWid()},
                        seq: e.data.seq
                    });
                    _wm.showWindow({wid: win.getWid()});
                    proc.container.worker.postMessage({
                        type: 'showWindowNotify',
                        data: {wid: win.getWid()},
                        seq: e.data.seq
                    });
                    break;
                case 'hideWindow':
                    _wm.hideWindow(e.data.data);
                    break;
                case 'destroyWindow':
                    _wm.destroyWindow(e.data.data);
                    break;
                case 'configureWindow':
                    _wm.configureWindow(e.data.data);
                    break;
                case 'windowFrame':
                    var win = _wm.getWindow(e.data.data.wid);
                    if (win) {console.log(e.data.data.nal.byteLength);
                        win.getPlayer().decode(new Uint8Array(e.data.data.nal));
                    }
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