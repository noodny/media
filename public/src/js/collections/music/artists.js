define([
    'config',
    'collections/paginated',
    'models/music/artist'
], function(config, PaginatedCollection, Model) {
    var Collection = PaginatedCollection.extend({ 
        model: Model,
        initialize: function(elements, options) {
            options = options || {};

            if(options.type) {
                this.type = options.type;
            }

            Backbone.Collection.prototype.initialize.apply(this, arguments);
        },
        url: function() {
            var url = config.apiUrl;

            if(this.type.indexOf('search') === 0) {
                var query = this.type.replace('search/', '');
                url += 'spotify/search/' + query + '?type=artist';
            }

            url += (url.indexOf('?') > -1 ? '&' : '?') + this.getQueryParams();

            return url;
        }
    });

    return Collection;
});
