define([
    'config',
    'collections/paginated',
    'models/music/album'
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
            var url = config.apiUrl;

            if(this.type.indexOf('artist') === 0) {
                var id = this.type.replace('artist-', '');
                url += 'spotify/artists/' + id + '/albums';
            }

            if(this.type.indexOf('search') === 0) {
                var query = this.type.replace('search/', '');
                url += 'spotify/search/' + query + '?type=album';
            }

            url += (url.indexOf('?') > -1 ? '&' : '?') + this.getQueryParams();

            return url;
        }
    });

    return Collection;
});
