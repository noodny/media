define(function() {
    function setParams(params) {
        this.params = {
            next: true,
            offset: params.offset + params.limit,
            limit: params.limit
        }
    }

    function clearParams() {
        this.params = {
            next: false,
            offset: 0,
            limit: 0
        }
    }

    var Collection = Backbone.Collection.extend({
        parse: function(data) {
            var items = _.isArray(data) ? data : data.items || data.tracks || data.playlists || data.albums || [];

            if(_.has(data, ['next', 'offset', 'limit']) && data.next) {
                setParams.call(this, data)
            } else {
                clearParams.call(this);
            }

            return items;
        },
        getQueryParams: function() {
            if(this.hasNext()) {
                return '?limit=' + this.params.limit + '&offset=' + this.params.offset;
            } else {
                return '';
            }
        },
        fetchNext: function() {
            if(this.hasNext()) {
                return this.fetch();
            } else {
                return $.Deferred().resolve({items: []});
            }
        },
        hasNext: function() {
            return this.params ? this.params.next : false;
        }
    });

    return Collection;
});
