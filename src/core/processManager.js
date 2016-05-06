define(['core/process', 'core/helper', 'core/windowManager', 'contextMenu'], function(_process, _helper, _wm, _contextMenu) {
	
	var g_proc_id = 1;
    var processes = [];
    
    function killit(key, opt){
    	kill(opt.$trigger.attr("proc-id"));
    }
    
    /**
     * refresh proc bar in menubar
     */
    function refreshBar() {
        $('owd-menubar procs').html('');
        for (var i in processes) {
            var proc = processes[i];
            var app = processes[i].getApp();
            $('owd-menubar procs').append('<proc proc-id="'+processes[i].pid+'"><img src="'+_helper.join(app.getUrl(), app.getConfig().icons['64x64'])+'"/> '+app.getConfig().name+'</proc>');
            $.contextMenu({
                selector: 'owd-menubar procs proc[proc-id="'+processes[i].pid+'"]',
                items: {
                    kill: {
                        name: "关闭",
                        icon: 'quit',
                        callback: killit
                    }
                }
            });
        }
    }
    
    function getProcById(pid) {
        for (var i in processes) {
            if (processes[i].pid == pid) {
                return processes[i];
            }
        }
    }
    
    function kill(proc) {
        if (typeof(proc) == 'string') {
            proc = getProcById(proc);
        }
        proc.container.stop();
        
        /* remove windows, WARNING: don't splice windows in _wm.destroyWindow, 
         * because it will cause bellow for loop index a mess, must filter windows after destroy */

        var windows = require('core/windowManager').getWindows();
        for (var i in windows) {
            var pid = windows[i].wid.split('_')[0];
            if (pid == proc.pid) {
                windows[i].destroy();
            }
        }
        windows.filter(function(win) {
            var pid = win.wid.split('_')[0];
            return pid != proc.pid;
        });
        
        /* remove proc */
        for (var i in processes) {
            if (processes[i].pid == proc.pid) {
                processes.splice(i, 1);
                break;
            }
        }
        refreshBar();
    }
    
    function create(opts) {
        var pid = g_proc_id++;
        var proc = _process.create(pid, opts);
        processes.push(proc);
        refreshBar();
        
        return proc;
    }

    function getAllProcesses() {
        return processes;
    }
    
    return {
        create: create,
        getAllProcesses: getAllProcesses,
        getProcById: getProcById,
    };
});