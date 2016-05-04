var g_seq = 1;
var g_callbacks = {};
var g_wid = 1;

self.loadScripts = function() {
    for (var i in arguments) {
        importScripts(self.Owdapp.appInfo.url + '/' + arguments[i]);
    }
}

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

function request(data, cb) {
    var seq = g_seq++;
    var send_data = {data: data, seq: seq};
    if (cb) {
        g_callbacks[seq] = cb;
    }
    postMessage(send_data);
}

onmessage = function(msg) {
    var seq = msg.data.seq;
    (g_callbacks[seq] || function(){})(msg.data.data);
}

request({
    type: 'getAppInfo'
}, function(data) {
    self.Owdapp.appInfo = data;
    loadScripts('main.js');
});

self.Owdapp = {
    appInfo: {},
    createWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        request({type: 'createWindow', data: opts}, cb);
    },
    createShowWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        if (opts.contentTpl) {
            ajax({
                url: self.Owdapp.appInfo.url + '/' + opts.contentTpl,
                success: function(d) {
                    opts.contentTplStr = d;
                    request({type: 'createShowWindow', data: opts}, cb);
                }
            })
        } else {
            request({type: 'createShowWindow', data: opts}, cb);
        }
    },
    showWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        if (opts.contentTpl) {
            ajax({
                url: self.Owdapp.appInfo.url + '/' + opts.contentTpl,
                success: function(d) {
                    opts.contentTplStr = d;
                    request({type: 'showWindow', data: opts}, cb);
                }
            })
        } else {
            request({type: 'showWindow', data: opts}, cb);
        }
    },
    hideWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        request({type: 'hideWindow', data: opts}, cb);
    },
    destroyWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        request({type: 'destroyWindow', data: opts}, cb);
    },
    configureWindow: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        request({type: 'configureWindow', data: opts}, cb);
    },
    windowFrame: function(opts, cb) {
        opts.wid = opts.wid || g_wid++;
        opts.wid = self.Owdapp.appInfo.pid + '_' + opts.wid;
        request({type: 'windowFrame', data: opts}, cb);
    },
    showLoading: function(cb) {
        request({type: 'showLoading', data: {}}, cb);
    },
    hideLoading: function(cb) {
        request({type: 'hideLoading', data: {}}, cb);
    },
    exit: function() {
        
    }
}


