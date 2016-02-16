define([
    'models/series'
], function(Series) {
    var Collection = Backbone.Collection.extend({
        model: Series
    });

    return Collection;
});
