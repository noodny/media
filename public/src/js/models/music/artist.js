define([
], function() {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            uri: null,
            name: null
        },

        parse: function(data) {
            return {
                id: data.id,
                uri: data.uri,
                name: data.name
            }
        },

        getUrl: function() {
            return '#!/music/browse/artist/' + this.get('id');
        }
    });

    return Model;
});
