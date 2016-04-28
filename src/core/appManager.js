define([
    'core/registry',
    'jquery',
    'core/container',
    'core/windowManager',
    'core/helper',
    'core/processManager',
    'core/app',
    'core/ui',
    'core/launcher'
], function(_registry, $, _container, _wm, _helper, _processManager, _app, _ui, _launcher) {
    var apps = [];

    /**
     * install app
     */
    function install(url, cb) {
        $.getJSON(_helper.join(url, "owdapp.json")).fail(function() {
            alert('no such app: ' + url);
        }).done(function(appconfig) {
            var uuid = _helper.uuid();
            var app = _app.create({id: uuid, url: url, config: appconfig});
            apps.push(app);
            _ui.addIcon(app);
            (cb || function() {
            })(app);
        });
    }

    /**
     * install app and run
     * @param url
     */
    function installRun(url) {
        install(url, function(app) {
            run(app);
        });
    }

    /**
     * run app
     */
    function run(app) {
        _launcher.launch(app);
    }

    return {
        install: install,
        run: run,
        installRun: installRun
    };
});
