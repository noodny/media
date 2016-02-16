define([
    'models/music/radio'
], function(Radio) {
    var Collection = Backbone.Collection.extend({
        model: Radio
    });

    return Collection;
});
