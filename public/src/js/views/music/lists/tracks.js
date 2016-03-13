define([
    'collections/music/tracks',
    'text!templates/music/lists/tracks.html',
    'text!templates/music/lists/items/track.html'
], function(Collection, template, itemTemplate) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            this.options = options;

            this.collection = new Collection(options.elements || [], {
                type: options.type || 'my'
            });
        },
        render: function() {
            this.$el.html(template);

            if(!this.options.fetched) {
                this.collection.fetch()
                    .done(this.onFetchSuccess.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                this.renderItems();
            }
        },
        renderItems: function() {
            var html = '';

            this.collection.each(function(item) {
                html += _.template(itemTemplate, {track: item});
            });

            this.$('.items-list').html(html).addClass('loaded');

            this.trigger('render');
        },
        onFetchSuccess: function(data) {
            this.renderItems();
        },
        onFetchFailure: function() {
            console.error('TracksView: failed fetching tracks collection')
        }
    });

    return View;
});
