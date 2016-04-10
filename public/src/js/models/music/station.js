define([
    'config'
], function(config) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            title: null,
            urls: null,
            pinned: null
        },

        url: function() {
            return config.apiUrl + 'radio/stations/' + this.get('id');
        },

        getImage: function() {
            if(!this.get('image')) {
                return '';
            }
            return config.baseUrl + 'radio-posters/' + this.get('image');
        }
    });

    return Model;
});
