define([
    'config',
    'collections/paginated',
    'models/music/artist'
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
            //TODO: handle default fetching
        }
    });

    return Collection;
});
