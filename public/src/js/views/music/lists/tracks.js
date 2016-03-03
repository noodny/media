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
            if(!this.options.fetched) {
                this.collection.fetch()
                    .done(this.onFetchSuccess.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                this.renderItems();
            }
        },
        renderItems: function() {
            this.$el.html(_.template(template, {
                itemTemplate: itemTemplate,
                tracks: this.collection
            }));
        },
        onFetchSuccess: function(data) {
            this.renderItems();
        },
        onFetchFailure: function() {
            console.error('TracksView: failed fetching playlist collection')
        }
    });

    return View;
});
