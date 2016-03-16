define([
    'config',
    'socket',
    'views/layout/header',
    'views/layout/player'
], function(config, socket, HeaderView, PlayerView) {
    var instance,
        Application = {
            initialize: function(router) {
                $.getScript(config.apiUrl + 'socket.io/socket.io.js')
                    .done(function() {
                        this.$container = $('#page-container');

                        this.router = router;

                        this.headerView = new HeaderView({
                            el: $('#header-container')
                        });
                        this.headerView.render();

                        this.playerView = new PlayerView({
                            el: $('#player-container')
                        });
                        this.playerView.render();

                        this.router.on('viewChange', function(view, options) {
                            this.setCurrentView(view, options);
                        }, this);

                        this.router.on('route', function(route) {
                            this.headerView.trigger('routeChange', route);
                        }.bind(this));

                        socket.initialize();
                        this.router.start();
                    }.bind(this));
            },
            setCurrentView: function(View, options) {
                if(this.currentView) {
                    this.currentView.undelegateEvents();
                    this.currentView.stopListening();
                    this.$container.empty();

                    if(this.currentView.destroy) {
                        this.currentView.destroy();
                    }
                }

                this.currentView = new View({
                    el: this.$container
                }, options || {});
                this.currentView.render();
            }
        };

    if(!instance) {
        instance = _.extend(Application, Backbone.Events);
    }

    return instance;
});
