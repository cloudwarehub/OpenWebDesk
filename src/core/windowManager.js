define(['core/window', 'core/ui'], function(_window, _ui) {
    var windows = [];
    var g_wid = 1;

    function getWindow(wid) {
        for (var i in windows) {
            if (windows[i].getWid() == wid) {
                return windows[i];
            }
        }
    }

    function createWindow(opts) {
        if (!opts.wid) {
            opts.wid = g_wid++;
        }
        opts.zindex = _ui.getIncreaseZindex();
        var window = _window.create(opts);
        windows.push(window);
        return window;
    }

    function destroyWindow(window) {
        for (var i in windows) {
            if (windows[i].getWid() == window.wid) {
                windows[i].destroy();
                break;
            }
        }
        windows.splice(i, 1);
    }
    
    function getActiveWindows() {
        var rs = [];
        for (var i in windows) {
            if (windows[i].isActive()) {
                rs.push(windows[i]);
            }
        }console.log(rs);
        return rs;
    }


    return {
        getWindow: getWindow,
        getWindows: function() {
            return windows;
        },
        createWindow: createWindow,
        showWindow: function(opts) {
            var window = getWindow(opts.wid);
            if (opts.bare) {
                window.setBare(opts.bare);
            }

            window.show();
        },
        hideWindow: function(opts) {
            var window = getWindow(opts.wid);
            window.hide();
        },
        destroyWindow: destroyWindow,
        configureWindow: function(opts) {
            var window = getWindow(opts.wid);
            window.configure(opts);
        },
        showLoading: function() {
            $("owd-loading-mask").show();
        },
        hideLoading: function() {
            $("owd-loading-mask").hide();
        },
        getActiveWindows: getActiveWindows
    };
});