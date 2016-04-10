define([
    'config',
    'models/music/station'
], function(config, Station) {
    var Collection = Backbone.Collection.extend({
        model: Station,

        initialize: function(models, options) {
            if(options && options.fetch) {
                this.fetchOptions = options.fetch;
            }
        },

        url: function() {
            var url = config.apiUrl + 'radio';

            if(this.fetchOptions) {
                if(this.fetchOptions.pinned) {
                    return url + '/pinned';
                }

                var filters = [];
                _.each(this.fetchOptions, function(value, key) {
                    filters.push(key + '::' + value);
                });
                url += '/stations?filter=' + filters.join('|');
            }

            return url;
        }
    });

    return Collection;
});
