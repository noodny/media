define([
    'config',
    'views/search',
    'views/music/lists/tracks',
    'views/music/album',
    'models/music/artist',
    'collections/music/albums',
    'text!templates/music/browse/artist.html',
    'text!templates/music/artist.html'
], function(config, SearchView, TracksView, AlbumView, Artist, AlbumsCollection, template, artistTemplate) {
    var View = Backbone.View.extend({
        initialize: function(options, parameters) {
            if(parameters && parameters.id) {
                this.id = parameters.id;
            } else {
                // TODO: redirect to 404
            }

        },
        render: function() {
            this.$el.html(_.template(template));

            this.$artist = this.$('.view-artist');

            this.model = new Artist({
                id: this.id
            });

            this.model.fetch()
                .done(this.onFetchSuccess.bind(this))
                .fail(this.onFetchFailure.bind(this));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            this.tracksView = new TracksView({
                type: 'artist-' + this.id,
                el: this.$('.view-tracks')
            });
            this.tracksView.render();
            this.listenTo(this.tracksView, 'render', this.onTracksViewRender.bind(this));

            this.collection = new AlbumsCollection([], {
                type: 'artist-' + this.id
            });
            this.collection.fetch()
                .done(this.onAlbumsFetchSuccess.bind(this))
                .fail(this.onAlbumsFetchFailure.bind(this));

            //this.albumsView = new AlbumsView({
            //    type: 'artist-' + this.id,
            //    el: this.$('.view-albums')
            //});
            //this.albumsView.render();
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
