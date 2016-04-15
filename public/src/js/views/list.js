define([
], function() {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(this.viewTemplate);

            if(!this.options.fetched) {
                this.fetching = true;
                this.collection.fetch()
                    .done(this.onFetchSuccess.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                this.renderItems();
            }
        },
        renderItems: function() {
            var html = '';

            this.collection.each(function(model) {
                html += _.template(this.itemTemplate, {model: model});
            }.bind(this));

            this.$('.items-list').append(html).addClass('loaded');
        },
        onFetchSuccess: function(data) {
            this.trigger('fetch-success', data);

            this.fetching = false;

            var $window = $(window);

            if(this.collection.hasNext()) {
                if(!this.paginationBound) {
                    var threshold = 300;
                    var $document = $(document);

                    this.paginationBound = true;
                    $window.on('scroll.' + this.cid, function() {
                        var windowHeight = $window.height();
                        var documentHeight = $document.height();
                        var top = $window.scrollTop();

                        if((documentHeight - top - windowHeight) <= threshold) {
                            this.$('.items-list').removeClass('loaded');
                            if(!this.fetching) {
                                this.fetching = true;
                                this.collection.fetchNext()
                                    .done(this.onFetchSuccess.bind(this))
                                    .fail(this.onFetchFailure.bind(this));
                            }
                        }
                    }.bind(this));
                }
            } else {
                $window.off('scroll.' + this.cid);
            }

            this.renderItems();
        },
        onFetchFailure: function() {
            this.fetching = false;

            console.error('ListView: failed fetching playlist collection')
        }
    });

    return View;
});
