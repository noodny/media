define([
    'config',
    'socket',
    'models/music/track'
], function(config, Socket, Track) {
    var Player = Backbone.Model.extend({
        url: config.apiUrl + 'player/status',
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
                    return this.onTrackFetchSuccess(data);
                }

                var track = new Track({
                    id: data.trackId
                });

                track.fetch()
                    .done(this.onTrackFetchSuccess.bind(this, data))
                    .fail(this.onTrackFetchFailure.bind(this));

                this.set('track', track);
            } else {
                this.onTrackFetchSuccess(data);
            }
        },
        onTime: function(time) {
            this.set('position', time);
            this.trigger('time');
        },
        onTrackFetchSuccess: function(data) {
            this.set(data);
            this.trigger('status');
        },
        onTrackFetchFailure: function() {
            console.error('PlayerView: track fetch failed');
        },
        command: function(command) {
            Socket.emit('player:command', {command: command});
        },
        getPosition: function() {
            var position = this.get('position') / (this.get('duration') / 1000) * 100;

            return position > 100 ? 100 : position;
        }
    });

    return Player;
});
