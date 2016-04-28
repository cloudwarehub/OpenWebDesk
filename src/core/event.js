define(['core/processManager'], function(_processManager) {
    function dispatch(event) {
        _processManager.getAllProcesses().forEach(function(proc) {
            proc.container.worker.postMessage(event);
        });
    }
    
    return {
        dispatch: dispatch
    };
});