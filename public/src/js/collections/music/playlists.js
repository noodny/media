define([
    'config',
    'collections/paginated',
    'models/music/playlist'
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

            if(this.type === 'featured') {
                url += 'spotify/featured-playlists';
            }

            if(this.type === 'my') {
                url += 'spotify/my-playlists';
            }

            if(this.type.indexOf('category') === 0) {
                var id = this.type.replace('category-', '');
                url += 'spotify/categories/' + id;
            }

            if(this.type.indexOf('search') === 0) {
                var query = this.type.replace('search/', '');
                url += 'spotify/search/' + query + '?type=playlist';
            }

            url += (url.indexOf('?') > -1 ? '&' : '?') + this.getQueryParams();

            return url;
        }
    });

    return Collection;
});
