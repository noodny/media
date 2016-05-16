define([
    'views/search',
    'views/music/lists/playlists',
    'views/music/lists/tracks',
    'views/music/lists/artists',
    'views/music/lists/albums',
    'views/music/lists/stations',
    'text!templates/music/search.html'
], function(SearchView, PlaylistsView, TracksView, ArtistsView, AlbumsView, StationsView, template) {
    var View = Backbone.View.extend({
        initialize: function(options, parameters) {
            parameters = parameters || {};
            this.query = parameters.query;
        },
        render: function() {
            this.$el.html(_.template(template));

            this.searchView = new SearchView({
                el: this.$('.view-search-container'),
                type: 'music',
                query: this.query
            });
            this.searchView.render();

            this.playlistsView = new PlaylistsView({
                elements: [],
                type: 'search/' + this.query,
                el: this.$('.view-playlists'),
                layout: 'grid',
                limit: 10
            });
            this.playlistsView.render();

            this.tracksView = new TracksView({
                elements: [],
                type: 'search/' + this.query,
                el: this.$('.view-tracks')
            });
            this.tracksView.render();

            this.artistsView = new ArtistsView({
                elements: [],
                type: 'search/' + this.query,
                el: this.$('.view-artists'),
                layout: 'grid'
            });
            this.artistsView.render();

            this.albumsView = new AlbumsView({
                elements: [],
                type: 'search/' + this.query,
                el: this.$('.view-albums'),
                layout: 'grid'
            });
            this.albumsView.render();

            this.stationsView = new StationsView({
                elements: [],
                type: 'search/' + this.query,
                el: this.$('.view-stations'),
                layout: 'grid'
            });
            this.stationsView.render();
        }
    });

    return View;
});
