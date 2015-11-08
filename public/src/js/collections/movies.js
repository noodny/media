define([
    'models/movie'
], function(Movie) {
    var Collection = Backbone.Collection.extend({
        model: Movie
    });

    return Collection;
});
