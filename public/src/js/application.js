define([
    'config',
    'views/layout/header',
    'views/layout/player'
], function(config, HeaderView, PlayerView) {
    var instance,
        Application = {
            initialize: function(router) {
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

                this.router.start();

                //TODO: remove
                $('body').on('click', '[data-play-id]', function(event) {
                    event.preventDefault();

                    var $el = $(event.currentTarget);
                    var id = $el.data('play-id');
                    var type = $el.data('play-type');

                    $.get(config.apiUrl + 'player/open?id=' + id + '&type=' + type);
                })
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
