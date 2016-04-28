var seq = 1;

function ajax(opts) {
    var url = opts.url || '';
    var type = opts.type || 'GET';

    var data = opts.data || {};
    data_array = [];
    for (idx in data) {
        data_array.push(idx + "=" + data[idx]);
    }
    data_string = data_array.join("&");

    var req = new XMLHttpRequest();
    req.open(type, url, false);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            return (opts.success || function() {
            })(req.responseText);
        }
    };
    (opts.beforeSend || function(req) {
    })(req);
    req.send(data_string);
    return req;
}

var windows = [];

self.Owdapp = {
    appInfo: {},
    createWindow: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        postMessage({type: 'createWindow', data: opts, seq: seq++});
    },
    createShowWindow: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        if (opts.contentTpl) {
            ajax({
                url: self.Owdapp.appInfo.url + '/' + opts.contentTpl,
                success: function(d) {
                    opts.contentTplStr = d;
                    postMessage({type: 'createShowWindow', data: opts, seq: seq++});
                }
            })
        } else {
            postMessage({type: 'createShowWindow', data: opts, seq: seq++});
        }
    },
    showWindow: function(opts, cb) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        if (opts.contentTpl) {
            ajax({
                url: self.Owdapp.appInfo.url + '/' + opts.contentTpl,
                success: function(d) {
                    opts.contentTplStr = d;
                    postMessage({type: 'showWindow', data: opts, seq: seq++});
                    (cb || function() {
                    })();
                }
            })
        } else {
            postMessage({type: 'showWindow', data: opts, seq: seq++});
            (cb || function() {
            })();
        }
    },
    hideWindow: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        postMessage({type: 'hideWindow', data: opts, seq: seq++});
    },
    destroyWindow: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        postMessage({type: 'destroyWindow', data: opts, seq: seq++});
    },
    configureWindow: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        postMessage({type: 'configureWindow', data: opts, seq: seq++});
    },
    showLoading: function() {
        postMessage({type: 'showLoading', seq: seq++});
    },
    hideLoading: function() {
        postMessage({type: 'hideLoading', seq: seq++});
    },
    windowFrame: function(opts) {
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        postMessage({type: 'windowFrame', data: opts, seq: seq++});
    }
}

self.loadScripts = function() {
    for (i in arguments) {
        importScripts(self.Owdapp.appInfo.url + '/' + arguments[i]);
    }
}

onmessage = function(msg) {
    self.Owdapp.appInfo = msg.data;
    onmessage = null;
    loadScripts('main.js');
}
