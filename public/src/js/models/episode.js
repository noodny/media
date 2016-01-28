define([
    'utils'
], function(utils) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            mdbId: null,
            downloadId: null,
            status: null,
            title: null,
            description: null,
            rating: null,
            duration: null,
            progress: {
                downloading: null,
                playing: null
            },
            episode: null,
            season: null,
            image: null,
            watched: null,
            hidden: null
        },

        getDuration: function() {
            return utils.formatTime(this.get('duration'));
        },

        getProgress: function() {
            var status = this.get('status');

            if(status === 'downloading') {
                return this.get('progress').downloading;
            }

            if(status === 'playing' || status === 'playing-paused') {
                return this.get('progress').playing;
            }

            return 0;
        },

        getStatusLabel: function() {
            var status = this.get('status');

            if(status === 'downloading') {
                return 'pobieranie';
            }

            if(status === 'playing') {
                return 'odtwarzanie';
            }

            if(status === 'playing-paused') {
                return 'wstrzymane';
            }
        },

        getActionLabel: function() {
            var status = this.get('status');

            if(status === 'downloading' || status === 'playing') {
                return 'zatrzymaj';
            }

            if(status === 'downloading-paused' || status === 'playing-paused') {
                return 'wznów';
            }

            return 'odtwórz';
        }
    });

    return Model;
});
