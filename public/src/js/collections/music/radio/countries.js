define(['config'], function(config) {
    var Collection = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: {
                name: null
            },

            getSlug: function() {
                return this.get('name').toLowerCase().replace(/[^a-z]/g, '');
            }
        }),

        comparator: 'name',

        url: function() {
            return config.apiUrl + 'radio/countries';
        }
    });

    return Collection;
});
