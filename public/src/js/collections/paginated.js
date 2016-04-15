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
            var items = _.isArray(data) ? data : data.items || data.tracks || data.playlists || data.albums || data.categories || [];
            
            if(items.items) {
                if(_.has(items, 'next') && _.has(items, 'offset') && _.has(items, 'limit')) {
                    data.next = items.next;
                    data.offset = items.offset;
                    data.limit = items.limit;
                }
                items = items.items;
            }

            if(_.has(data, 'next') && _.has(data, 'offset') && _.has(data, 'limit') && data.next) {
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
