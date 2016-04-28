define([
    'text!tpl/window.html',
    'core/ui',
    'jquery',
    'interact',
    'Player',
    'core/helper',
    'core/windowManager',
    'core/event'
], function(html, ui, $, Interact, Player, _helper, _wm, _event) {


    /**
     * remove script tags in template
     */
    function stripScripts(s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        var scripts = div.getElementsByTagName('script');
        var i = scripts.length;
        while (i--) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
        return div.innerHTML;
    }

    var Window = function(opts) {
        for (var i in opts) {
            this[i] = opts[i];
        }
        if (!opts.wid) {
            this.wid = Math.floor((Math.random() * 1000000) + 1); // TODO: check conflict
        }
        this.pid = 0;
        this.player = new Player({
            size: {
                width: 1024,
                height: 768
            }
        });
    };
    Window.prototype = {
        getWid: function() {
            return this.wid;
        },
        getPlayer: function() {
            return this.player;
        },
        getDom: function() {
            return $('#window_' + this.wid);
        },
        set: function(key, value) {
            this[key] = value;
        },
        setX: function(value) {
            this.x = value;
            if (this.getDom().length) {
                this.getDom().css('left', this.x);
            }
            return this;
        },
        setY: function(value) {
            this.y = value;
            var y = this.y;
            if (this.getDom().length) {
                var __y = this.bare ? y : y - 30;
                this.getDom().css('top', __y);
            }
            return this;
        },
        setWidth: function(value) {
            this.width = value;
            if (this.getDom().length) {
                this.getDom().css('width', this.width);
                this.getDom().find("canvas").css('width', this.width);
            }
        },
        setHeight: function(value) {
            this.height = value;
            if (this.getDom().length) {
                this.getDom().css('height', this.bare ? this.height : this.height + 30);
                //this.getDom().find("canvas").css('height', this.height);
            }
        },
        setBare: function(value) {
            this.bare = value;
            return this;
        },
        maximize: function() {
            this.getDom().css('left', 0).css('top', 0).width($(document).width()).height($(document).height()).css('transform', '');
            // $("#window_"+this.wid+' canvas').get(0).getContext('2d').canvas.width = $(document).width();
            // $("#window_"+this.wid+' canvas').get(0).getContext('2d').canvas.height = $(document).height();
            _event.dispatch({type: 'windowMove', data: {wid: this.wid, x: 0, y: 30}});
            _event.dispatch({
                type: 'windowResize',
                data: {wid: this.wid, width: $(document).width(), height: $(document).height()}
            });
        },
        hide: function() {
            this.getDom().hide();
        },
        destroy: function() {
            this.getDom().remove();
            //_wm.destroyWindow(this);
            (this.onDestroy || function() {
            })(this);
        },
        configure: function(opts) {
            this.setX(opts.x);
            this.setY(opts.y);
            this.setWidth(opts.width);
            this.setHeight(opts.height);
        },
        show: function() {
            if (this.getDom().length !== 0) {
                this.getDom().show();
                return;
            }
            var self = this;

            this.top_show = this.bare ? 'none' : 'block';
            $('owd-desktop').append(_helper.render(html, this));
            if (this.contentTpl) {
                self.getDom().find('owd-window-content').html(_helper.render(stripScripts(this.contentTplStr), self));
            }
            if (this.type == 'cloudware') {
                self.getDom().find('owd-window-content').html(this.player.canvas);
            }
            self.getDom().find('owd-window-button-maximize').click(function() {
                self.maximize();
            });
            self.getDom().find('owd-window-button-close').click(function() {
                self.hide();
            });
            Interact('#window_' + this.wid + ' owd-window-title').draggable({
                onmove: dragMoveListener,
                onend: function(event) {
                    _event.dispatch({
                        type: 'windowMove',
                        data: {wid: self.wid, x: self.x + event.dx, y: self.y + event.dy}
                    });
                }
            }).styleCursor(false);
            Interact('#window_' + this.wid).resizable({
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                },
                onend: function(event) {
                    _event.dispatch({
                        type: 'windowResize',
                        data: {wid: self.wid, width: self.width, height: self.height}
                    });
                },
            }).on('resizemove', function(event) {
                var target = event.target, x = (parseFloat(target.getAttribute('data-resize-x')) || 0), y = (parseFloat(target.getAttribute('data-resize-y')) || 0);

                // update the element's style
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                self.width = event.rect.width;
                self.height = event.rect.height;

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-resize-x', x);
                target.setAttribute('data-resize-y', y);
            });
            function dragMoveListener(event) {
                var target = event.target.parentNode.parentNode, x = (parseFloat(target.style.left) || 0) + event.dx, y = (parseFloat(target.style.top) || 0) + event.dy;

                target.style.left = x + 'px';
                target.style.top = y + 'px';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }

            $('#window_' + this.wid + ' canvas').mousemove(function(e) {
                _event.dispatch({type: 'mousemove', data: {wid: self.wid, x: e.offsetX, y: e.offsetY}});
            });
            $('#window_' + this.wid + ' canvas').mousedown(function(e) {
                _event.dispatch({type: 'mousedown', data: {wid: self.wid, code: e.which}});
                return false;
            });
            $('#window_' + this.wid + ' canvas').mouseup(function(e) {
                _event.dispatch({type: 'mouseup', data: {wid: self.wid, code: e.which}});
                return false;
            });
            if (!this.bare && this.y < 15) {
                _event.dispatch({type: 'windowMove', data: {wid: this.wid, x: this.x, y: 30}});
            }
        }
    };

    function create(opts) {
        var w = new Window(opts);
        return w;
    }

    return {
        create: create
    };
});