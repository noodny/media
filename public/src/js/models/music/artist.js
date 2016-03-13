define([
    'config'
], function(config) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            uri: null,
            name: null,
            image: null,
            followers: null
        },

        url: function() {
            return config.apiUrl + 'spotify/artists/' + this.get('id')
        },

        parse: function(data) {
            return {
                id: data.id,
                uri: data.uri,
                name: data.name,
                followers: (data.followers ? data.followers.total || 0 : 0),
                image: (data.images ? data.images[0].url : null)
            }
        },

        getUrl: function() {
            return '#!/music/browse/artist/' + this.get('id');
        }
    });

    return Model;
});
