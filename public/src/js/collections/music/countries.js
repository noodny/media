define([], function() {
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

        parse: function(data) {
            return _.map(data, function(el) {
                return {
                    name: el
                };
            });
        }
    });

    return Collection;
});
