define([
    'config',
    'collections/paginated',
    'models/music/track'
], function(config, PaginatedCollection, Model) {
    var Collection = PaginatedCollection.extend({
        model: Model,
        initialize: function(elements, options) {
            if(options.type) {
                this.type = options.type;
            }

            Backbone.Collection.prototype.initialize.apply(this, arguments);
        },
        url: function() {
            //TODO: handle this.type
            return config.apiUrl + 'spotify/my-tracks' + this.getQueryParams();
        }
    });

    return Collection;
});
