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

        getImage: function() {
            if(!this.get('image')) {
                return '';
            }
            return config.apiUrl + 'radio-posters/' + this.get('image');
        }
    });

    return Model;
});
