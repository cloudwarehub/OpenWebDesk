define(['core/processManager'], function(_processManager) {
    function dispatch(event, proc_id) {
        if (proc_id) {
            var proc = _processManager.getProcById(proc_id);
            proc.container.worker.postMessage(event);
        } else {
            _processManager.getAllProcesses().forEach(function(proc) {
                proc.container.worker.postMessage(event);
            });
        }
        
    }
    
    return {
        dispatch: dispatch
    };
});