define([
    'config',
    'socket',
    'models/music/track',
    'models/music/station'
], function(config, Socket, Track, Station) {
    var Player = Backbone.Model.extend({
        url: config.playerUrl + 'player/status',
        initialize: function() {
            Socket.on('player:status', this.onStatus.bind(this));
            Socket.on('player:time', this.onTime.bind(this));
        },
        parse: function(data) {
            this.onStatus(data);
            return data;
        },
        onStatus: function(data) {
            if(data.type === 'spotify') {
                if(data.trackId === null) {
                    return this.onTrackFetchSuccess(data);
                }

                if(this.get('track') && this.get('track').get('id') === data.trackId) {
                    this.set(data);
                    return this.onTrackFetchSuccess(data);
                }

                var track = new Track({
                    id: data.trackId
                });

                track.fetch()
                    .done(this.onTrackFetchSuccess.bind(this, data))
                    .fail(this.onTrackFetchFailure.bind(this));

                data.track = track;

                this.set(data);
            } else if(data.type === 'radio') {
                if(data.id === null) {
                    this.set(data);
                    return this.onTrackFetchSuccess(data);
                }

                if(this.get('station') && this.get('station').get('id') === data.id) {
                    this.set(data);
                    return this.onTrackFetchSuccess(data);
                }

                var station = new Station({
                    id: data.id
                });

                data.station = station;

                this.set(data);

                station.fetch()
                    .done(this.onTrackFetchSuccess.bind(this, data))
                    .fail(this.onTrackFetchFailure.bind(this));
            } else {
                this.onTrackFetchSuccess(data);
            }
        },
        onTime: function(time) {
            this.set('position', time);
            this.trigger('time');
        },
        onTrackFetchSuccess: function(data) {
            this.trigger('status');
        },
        onTrackFetchFailure: function() {
            console.error('PlayerView: track fetch failed');
        },
        open: function(data) {
            Socket.emit('player:open', data);
        },
        command: function(command, parameters) {
            if(command === 'toggle') {
                if(this.get('state') === 'playing') {
                    this.set('state', 'paused');
                } else {
                    this.set('state', 'playing');
                }
                this.trigger('status');
            }
            if(parameters && !_.isArray(parameters)) {
                parameters = [parameters];
            }

            var data = {
                command: command
            };

            if(parameters) {
                data.parameters = parameters;
            }

            Socket.emit('player:command', data);
        },
        getPosition: function() {
            var position = this.get('position') / (this.get('duration') / 1000) * 100;

            return position > 100 ? 100 : position;
        }
    });

    return Player;
});
