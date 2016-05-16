define([
    'config',
    'models/music/station'
], function(config, Station) {
    var Collection = Backbone.Collection.extend({
        model: Station,

        initialize: function(models, options) {
            options = options || {};

            if(options.fetch) {
                this.fetchOptions = options.fetch;
            }

            if(options.type) {
                this.type = options.type;
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

            if(this.type && this.type.indexOf('search') === 0) {
                var query = this.type.replace('search/', '');
                url += '/search/' + query;
            }

            return url;
        }
    });

    return Collection;
});
