define([
    'config',
    'views/music/lists/tracks',
    'text!templates/music/album.html'
], function(config, TracksView, template) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            if(options.id) {
                this.id = options.id;
                // TODO: fetching
            } else if(options.model) {
                this.model = options.model;
            }
        },
        render: function() {
            this.$el.html(_.template(template, {album: this.model}));

            this.tracksView = new TracksView({
                type: 'album-' + this.model.get('id'),
                el: this.$('.view-album-tracks')
            });
            this.tracksView.render();
        },
        renderAlbums: function() {
            var html = '';

            this.collection.each(function(album) {
                html += '<div class="view-album" data-id="' + album.get('id') + '"></div>';
            });

            this.$('.view-albums').html(html);

            this.albumViews = [];

            this.collection.each(function(album) {
                var view = new AlbumView({
                    el: this.$('.view-albums .view-album[data-id="' + album.get('id') + '"]'),
                    model: album
                });
                this.albumViews.push(view);
                view.render();
            }.bind(this));
        },
        onAlbumsFetchSuccess: function() {
            this.renderAlbums();
        },
        onAlbumsFetchFailure: function() {
            console.error('ArtistView: failed fetching artist albums list');
        },
        onFetchSuccess: function() {
            this.$artist.html(_.template(artistTemplate, {artist: this.model}));
        },
        onFetchFailure: function() {
            console.error('ArtistView: failed fetching artist model');
        },
        onTracksViewRender: function() {
            var $button = this.$('.popular-tracks .button');
            var $tracks = $(this.$('.popular-tracks .list-item-track').splice(5, 5));

            $tracks.hide();
            $button.on('click', function(event) {
                event.preventDefault();

                $button.toggleClass('active');
                $tracks.toggle();
            });
        }
    });

    return View;
});
