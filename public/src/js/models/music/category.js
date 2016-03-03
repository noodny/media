define([
], function() {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            uri: null,
            name: null,
            image: null,
            description: null
        },

        parse: function(data) {
            var parsed = {
                id: data.id,
                name: data.name,
                image: data.icons.shift().url,
                description: data.description
            };

            return parsed;
        },

        getUrl: function() {
            return '#!/music/browse/category/' + this.get('id');
        }
    });

    return Model;
});
