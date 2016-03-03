define([
    'utils/device',
    'collections/series',
    'views/series/episodes',
    'views/search',
    'text!templates/series.html'
], function(device, SeriesCollection, EpisodesView, SearchView, template) {
    var View = Backbone.View.extend({
        events: {
            'click .list-item-episode': 'onListItemClick'
        },
        render: function() {
            this.collection = new SeriesCollection([
                {
                    id: 1,
                    title: 'The Walking Dead'
                },
                {
                    id: 2,
                    title: 'Grey\'s Anatomy'
                }
            ], {parse: true});

            this.$el.html(_.template(template, {
                series: this.collection
            }));

            this.episodesViews = {};

            this.collection.each(function(series) {
                var id = series.get('id');

                if(this.episodesViews[id]) {
                    return;
                }

                this.episodesViews[id] = new EpisodesView({
                    el: this.$('[data-series-id="' + id + '"]')
                });
                this.episodesViews[id].render();
            }.bind(this));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            $(window).on('resize', _.throttle(this.onWindowResize.bind(this), 200));
            this.onWindowResize();
        },
        onListItemClick: function(event) {
            event.preventDefault();

            if(device.isTouch()) {
                var $el = $(event.currentTarget);

                var $items = this.$('.list-item-episode');

                $items.not($el).removeClass('active');
                $el.toggleClass('active');
            }
        },
        onWindowResize: function() {
            var $items = this.$('.list-item-episode');
            var $lists = this.$('.episodes-list');

            if(device.isViewportWidthGte(480)) {
                var $item = $items.filter(':not(.active)').first();

                if($item) {
                    var height = $item.parent().removeAttr('style').height();
                    $items.parent().height(height);
                }

                if(device.isViewportWidthGte(1024)) {
                    var width = 0;

                    if(device.isViewportWidthGte(1200)) {
                        width = (device.getViewportWidth() - 1200) / 2;
                    }

                    $lists.css('padding-left', width + 42 - 10);
                } else {
                    $lists.removeAttr('style');
                }
            } else {
                $items.parent().removeAttr('style');
                $lists.removeAttr('style');
            }
        }
    });

    return View;
});
