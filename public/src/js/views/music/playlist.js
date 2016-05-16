define([
    'config',
    'views/music/lists/tracks',
    'text!templates/music/album.html'
], function(config, TracksView, template) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            if(options.model) {
                this.model = options.model;
            }
        },
        render: function() {
            this.$el.html(_.template(template, {album: this.model}));

            this.tracksView = new TracksView({ 
                type: 'playlist-' + this.model.get('uri'),
                el: this.$('.view-album-tracks')
            });
            this.tracksView.render();
        }
    });

    return View;
});
