define([
    'models/episode'
], function(Episode) {
    var Collection = Backbone.Collection.extend({
        model: Episode,
        comparator: function(episode) {
            // order episodes by season and episode number descending
            return -1*parseInt('' + episode.get('season') + episode.get('episode'));
        }
    });

    return Collection;
});
