define([
    'config',
    'models/player',
    'text!templates/layout/player.html'
], function(config, Player, template) {
    var View = Backbone.View.extend({
        events: {
            'click .player-details, .player-expand': 'onPlayerDetailsClick',
            'click .player-collapse': 'onPlayerCollapseClick',
            'click [data-player-control]': 'onPlayerControlClick',
            'change .player-scrubber-pane': 'onPlayerScrubberChange',
            'input .player-scrubber-pane': 'onPlayerScrubberInput',
            'click .player-scrubber-pane': 'onPlayerScrubberClick',
            'click .player-scrubber-progress': 'onPlayerScrubberClick'
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
                station: this.model.get('station'),
                title: this.model.get('title'),
                repeat: this.model.get('repeat'),
                shuffle: this.model.get('shuffle'),
                position: this.model.getPosition()
            }));
            this.$title = this.$('.title');
            this.$artists = this.$('.artists');
            this.$playlist = this.$('.playlist');
            this.$scrubber = this.$('.player-scrubber-pane');
            this.$scrubberProgress = this.$('.player-scrubber-progress');
        },
        onPlayerFetch: function() {
            if(this.model.get('state') === 'idle') {
                this.$el.removeClass('visible');
            } else {
                this.$el.addClass('visible');
            }

            this.$el.attr('class', function(i, cls) {
                if(/player-/.test(cls)) {
                    return cls.replace(/player-[^ ]*]/, 'player-' + this.model.get('type'));
                } else {
                    return cls + ' player-' + this.model.get('type');
                }
            }.bind(this))
        },
        onStatusChange: function() {
            this.onPlayerFetch();
            this.render();
        },
        onTimeChange: function() {
            if(this.dragging) {
                return;
            }
            this.$scrubber.val(this.model.getPosition());
            this.$scrubberProgress.width(this.model.getPosition() + '%');
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
        },
        onPlayerScrubberInput: function(event) {
            this.dragging = true;
            var value = this.$scrubber.val();
            this.$scrubberProgress.width(value + '%');
        },
        onPlayerScrubberChange: function(event) {
            var ms = (this.$scrubber.val() / 100) * this.model.get('duration');

            this.model.command('seek', ms);
            this.dragging = false;

            // force the layout time change
            this.model.onTime(ms / 1000);
        },
        onPlayerScrubberClick: function(event) {
            this.dragging = true;
            var value = (event.offsetX / this.$scrubber.width()) * 100;
            this.$scrubber.val(value);
            this.$scrubber.trigger('change');
        }
    });

    return View;
});
