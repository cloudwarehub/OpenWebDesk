define(['owd/process', 'owd/helper', 'contextMenu', 'owd/wm'], function(_process, _helper, _contextMenu, _wm) {
	var proc_id = 1;
	var processes = [];
	
	/**
	 * refresh proc bar in menubar
	 */
	function refreshBar() {
		$('owd-menubar procs').html('');
		for (i in processes) {
			var proc = processes[i];
			var app = processes[i].getApp();
			$('owd-menubar procs').append('<proc proc-id="'+processes[i].pid+'"><img src="'+_helper.join(app.getUrl(), app.getConfig().icons['64x64'])+'"/> '+app.getConfig().name+'</proc>');
			$.contextMenu({
			    selector: 'owd-menubar procs proc[proc-id="'+processes[i].pid+'"]',
			    items: {
			        kill: {
			            name: "关闭",
			            icon: 'quit',
			            callback: function(key, opt){
			            	kill(opt.$trigger.attr("proc-id"));
			            }
			        }
			    }
			});
		}
	}
	
	function findProcByPid(pid) {
		for (i in processes) {
			if (processes[i].pid == pid) {
				return processes[i];
			}
		}
	}
	
	function kill(proc) {
		if (typeof(proc) == 'string') {
			proc = findProcByPid(proc);
		}
		proc.container.stop();
		
		/* remove windows, WARNING: don't splice windows in _wm.destroyWindow, 
		 * because it will cause bellow for loop index a mess, must filter windows after destroy */
		var windows = _wm.getWindows();
		for (i in windows) {
			if (windows[i].proc.pid == proc.pid) {console.log(windows[i].wid)
				_wm.destroyWindow({wid: windows[i].wid});
			}
		}
		windows.filter(function(win) {
			return win.proc.pid != proc.pid;
		});
		
		/* remove proc */
		for (i in processes) {
			if (processes[i].pid == proc.pid) {
				processes.splice(i, 1);
				break;
			}
		}
		refreshBar();
	}
	
	function create(pid, opts) {
		var pid = pid || proc_id++;
		var proc = _process.create(pid, opts);
		processes.push(proc);
		refreshBar();
		
		return proc;
	}
	
	return {
		create: create
	}
});