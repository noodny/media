define([
    'config',
    'models/player',
    'text!templates/layout/player.html'
], function(config, Player, template) {
    var View = Backbone.View.extend({
        events: {
            'click .player-details, .player-expand': 'onPlayerDetailsClick',
            'click .player-collapse': 'onPlayerCollapseClick',
            'click [data-player-control]': 'onPlayerControlClick'
        },
        initialize: function() {
            this.model = new Player();
            this.listenTo(this.model, 'status', this.onStatusChange.bind(this));
            this.listenTo(this.model, 'time', this.onTimeChange.bind(this));
            this.model.fetch()
                .done(this.onPlayerFetch.bind(this));

            $('body').on('click', '[data-play-id]', function(event) {
                event.preventDefault();

                var $el = $(event.currentTarget);
                var id = $el.data('play-id');
                var type = $el.data('play-type');

                // TODO: check if current view is the playlist context and use spop.goto
                this.model.open({
                    type: type,
                    id: id
                });
            }.bind(this));
        },
        render: function() {
            this.$el.html(_.template(template, {
                type: this.model.get('type'),
                state: this.model.get('state'),
                track: this.model.get('track'),
                position: this.model.getPosition()
            }));
            this.$title = this.$('.title');
            this.$artists = this.$('.artists');
            this.$playlist = this.$('.playlist');
            this.$scrubber = this.$('.player-scrubber .front');
        },
        onPlayerFetch: function() {
            if(this.model.get('state') === 'idle') {
                this.$el.removeClass('visible');
            } else {
                this.$el.addClass('visible');
            }
        },
        onStatusChange: function() {
            this.onPlayerFetch();
            this.render();
        },
        onTimeChange: function() {
            this.$scrubber.width(this.model.getPosition() + '%');
        },
        onPlayerDetailsClick: function(event) {
            event.preventDefault();

            if(!this.$el.hasClass('expanded')) {
                this.$el.addClass('expanded');
            }
        },
        onPlayerCollapseClick: function(event) {
            event.preventDefault();

            if(this.$el.hasClass('expanded')) {
                this.$el.removeClass('expanded');
            }
        },
        onPlayerControlClick: function(event) {
            event.preventDefault();

            var $el = $(event.currentTarget),
                command = $el.data('player-control');

            this.model.command(command);
        }
    });

    return View;
});
