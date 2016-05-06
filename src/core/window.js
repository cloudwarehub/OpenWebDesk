define([
    'text!tpl/window.html',
    'core/ui',
    'jquery',
    'interact',
    'Player',
    'core/helper',
    'core/windowManager',
    'core/event',
    'core/ui'
], function(html, ui, $, Interact, Player, _helper, _wm, _event, _ui) {


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

        /* set position to center if not specify xy */
        if (this.x === undefined) {
            this.x = $(window).width() / 2 - this.width / 2;
        }
        if (this.y === undefined) {
            this.y = ($(window).height() / 2 - this.height / 2) * 2 / 3; /* y is 2/3 to center top */
        }
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
            if (this.getDom().length) {
                this.getDom().css('top', this.y);
            }
            return this;
        },
        setWidth: function(value) {
            this.width = value;
            if (this.getDom().length) {
                this.getDom().css('width', this.width);
            }
        },
        setHeight: function(value) {
            this.height = value;
            if (this.getDom().length) {
                this.getDom().css('height', this.height);
            }
        },
        setBare: function(value) {
            this.bare = value;
            return this;
        },
        maximize: function() {
            if (this.isMaximized) {
                this.getDom().css('left', this.oldGeo.x).css('top', this.oldGeo.y).width(this.oldGeo.width).height(this.oldGeo.height).css('transform', '');
                _event.dispatch({type: 'windowMove', data: {wid: this.wid, x: this.oldGeo.x, y: this.oldGeo.y}});
                _event.dispatch({
                    type: 'windowResize',
                    data: {wid: this.wid, width: this.oldGeo.width, height: this.oldGeo.height}
                }, this.wid.split('_')[0]);
                this.isMaximized = false;
            } else {
                this.oldGeo = {
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                };
                this.getDom().css('left', 0).css('top', 0).width($(document).width()).height($(document).height()).css('transform', '');
                _event.dispatch({type: 'windowMove', data: {wid: this.wid, x: 0, y: 0}});
                _event.dispatch({
                    type: 'windowResize',
                    data: {wid: this.wid, width: $(document).width(), height: $(document).height() - 66}
                }, this.wid.split('_')[0]);
                this.isMaximized = true;
            }
        },
        hide: function() {
            this.getDom().hide();
        },
        destroy: function() {
            (this.beforeDestroy || function() {
            })(this);
            this.getDom().remove();
            (this.afterDestroy || function() {
            })(this);
        },
        configure: function(opts) {
            this.setX(opts.x);
            this.setY(opts.y);
            this.setWidth(opts.width);
            this.setHeight(opts.height);
        },
        setActive: function() {
            var self = this;
            this.active = true;
            this.getDom().attr('data-active', 'true');
            this.getDom().css('z-index', _ui.getIncreaseZindex());
            require('core/windowManager').getWindows().forEach(function(win) {
                if ((win.getWid() !== self.getWid())) {
                    win.getDom().attr('data-active', 'false');
                    win.active = false;
                }
            });
        },
        setZindex: function(zindex) {
            this.zindex = zindex;
            this.getDom().css('z-index', zindex);
        },
        isActive: function() {
            return this.active;
        },
        show: function() {
            if (this.getDom().length !== 0) {
                this.setZindex(_ui.getIncreaseZindex());
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

            self.getDom().css('z-index', self.zindex);
            self.getDom().attr('data-bare', self.bare?'true':'false');
            if (this.bare) {
                this.active = true;
            }
            if (!self.bare) {
                Interact('#window_' + this.wid + ' owd-window-title').draggable({
                    onmove: function(event) {
                        var target = event.target.parentNode.parentNode, x = (parseFloat(target.style.left) || 0) + event.dx, y = (parseFloat(target.style.top) || 0) + event.dy;


                        target.style.left = x + 'px';
                        //if (y >= 0)
                        target.style.top = y + 'px';

                        // update the posiion attributes
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    onend: function(event) {
                        _event.dispatch({
                            type: 'windowMove',
                            data: {wid: self.wid, x: self.x + event.dx, y: self.y + event.dy}
                        }, self.wid.split('_')[0]);
                    }
                }).styleCursor(false);
                Interact('#window_' + this.wid).resizable({
                    edges: {
                        left: true,
                        right: true,
                        bottom: true,
                        top: false
                    },
                    onend: function(event) {
                        _event.dispatch({
                            type: 'windowResize',
                            data: {wid: self.wid, width: self.width, height: self.height}
                        }, self.wid.split('_')[0]);
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
            }


            $('#window_' + this.wid + ' canvas').mousemove(function(e) {
                if (!self.active)
                    return;
                _event.dispatch({type: 'mousemove', data: {wid: self.wid, x: e.offsetX, y: e.offsetY}}, self.wid.split('_')[0]);
            });
            $('#window_' + this.wid + ' canvas').mousedown(function(e) {
                if (!self.active)
                    return;
                _event.dispatch({type: 'mousedown', data: {wid: self.wid, code: e.which}}, self.wid.split('_')[0]);
            });
            $('#window_' + this.wid + ' canvas').mouseup(function(e) {
                if (!self.active)
                    return;
                _event.dispatch({type: 'mouseup', data: {wid: self.wid, code: e.which}}, self.wid.split('_')[0]);
            });
            if (!self.bare) {
                this.getDom().mousedown(function() {
                    self.setActive();
                });
                self.setActive();
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