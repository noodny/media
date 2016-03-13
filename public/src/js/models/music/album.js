define([
], function() {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            image: null,
            name: null,
            uri: null
        },
        parse: function(data) {
            var parsed = {
                id: data.id,
                name: data.name,
                uri: data.uri
            };

            if(data.images && data.images.length) {
                parsed.image = data.images[0].url;
            }

            return parsed;
        }
    });

    return Model;
});
