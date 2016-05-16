define([
    'utils/device',
    'views/list',
    'collections/music/albums',
    'text!templates/music/lists/albums.html',
    'text!templates/music/lists/items/album.html'
], function(device, ListView, Collection, template, itemTemplate) {
    var View = ListView.extend({
        viewTemplate: template,
        itemTemplate: itemTemplate,

        initialize: function(options) {
            this.options = options || {};
            this.collection = new Collection(options.elements || [], {
                type: options.type || 'my'
            });

            if(this.options.layout) {
                this.$el.addClass('layout-' + this.options.layout);

                $(window).on('resize', _.throttle(this.onWindowResize.bind(this), 200));
            }
        },
        renderItems: function() {
            ListView.prototype.renderItems.call(this);
            this.onWindowResize();
        },
        onWindowResize: function() {
            var $items = this.$('.list-item-album .details');
            var $lists = this.$('.albums-list');

            $items.removeAttr('style');
            var maxHeight = Math.max.apply(null, $items.map(function() {
                return $(this).height();
            }).get());

            $items.height(maxHeight);

            if(this.options.layout === 'slider') {
                if(device.isViewportWidthGte(1024)) {
                    var width = 0;

                    if(device.isViewportWidthGte(1200)) {
                        width = (device.getViewportWidth() - 1200) / 2;
                    }

                    $lists.css('padding-left', width + 42 - 10);
                } else {
                    $lists.removeAttr('style');
                }
            }
        }
    });

    return View;
});
