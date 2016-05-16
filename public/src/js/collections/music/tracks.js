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
            var url = config.apiUrl;

            if(this.type === 'my') {
                url += 'spotify/my-tracks';
            }

            if(this.type.indexOf('artist') === 0) {
                var id = this.type.replace('artist-', '');
                url += 'spotify/artists/' + id + '/tracks';
            }

            if(this.type.indexOf('album') === 0) {
                var id = this.type.replace('album-', '');
                url += 'spotify/albums/' + id + '/tracks';
            }

            if(this.type.indexOf('playlist') === 0) {
                var id = this.type.replace('playlist-', '');
                url += 'spotify/playlists/' + id + '/tracks';
            }

            if(this.type.indexOf('search') === 0) {
                var query = this.type.replace('search/', '');
                url += 'spotify/search/' + query + '?type=track';
            }

            url += (url.indexOf('?') > -1 ? '&' : '?') + this.getQueryParams();

            return url;
        }
    });

    return Collection;
});
