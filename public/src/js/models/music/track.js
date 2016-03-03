define([
    'collections/music/artists',
    'utils/date'
], function(ArtistsCollection, date) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            uri: null,
            name: null,
            duration: 0,
            artists: null
        },

        getDuration: function() {
            return date.formatDuration(this.get('duration') / 1000);
        },

        parse: function(data) {
            if(data.track) {
                data = data.track;
            }

            var parsed = {
                id: data.id,
                uri: data.uri,
                name: data.name,
                duration: data.duration_ms
            };

            if(data.artists) {
                parsed.artists = new ArtistsCollection(data.artists, {parse: true});
            }

            return parsed;
        }
    });

    return Model;
});
