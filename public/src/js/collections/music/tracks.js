define([
    'models/music/track'
], function(Track) {
    var Collection = Backbone.Collection.extend({
        model: Track
    });

    return Collection;
});
