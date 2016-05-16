define([
    'config',
    'collections/paginated',
    'models/music/category'
], function(config, PaginatedCollection, Model) {
    var Collection = PaginatedCollection.extend({
        model: Model,
        initialize: function(elements, options) {
            Backbone.Collection.prototype.initialize.apply(this, arguments);
        },
        url: function() {
            return config.apiUrl + 'spotify/categories?' + this.getQueryParams();
        }
    });

    return Collection;
});
