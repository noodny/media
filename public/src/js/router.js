define([
    'views/movies',
    'views/series',
    'views/music',
    'views/music/radio',
    'views/music/search',
    'views/music/browse',
    'views/music/browse/category',
    'views/music/browse/artist',
    'views/music/browse/album',
    'views/photos',
    'views/error'
], function(MoviesView, SeriesView,
            MusicView, MusicRadioView, MusicSearchView, MusicBrowseView,
            MusicBrowseCategoryView, MusicBrowseArtistView, MusicBrowseAlbumView,
            PhotosView, ErrorView) {
    var Router = Backbone.Router.extend({
        routes: {
            "": "movies",
            "!": "movies",
            "!/": "movies",
            "!/movies": "movies",
            "!/series": "series",
            "!/music": "music",
            "!/music/search/:query": "musicSearch",
            "!/music/browse": "musicBrowse",
            "!/music/radio(/:filter)": "musicRadio",
            "!/music/browse/category/:id": "musicBrowseCategory",
            "!/music/browse/playlist/:id": "musicBrowsePlaylist",
            "!/music/browse/artist/:id": "musicBrowseArtist",
            "!/music/browse/album/:id": "musicBrowseAlbum",
            "!/photos": "photos",
            "*error": "error"
        },

        start: function() {
            Backbone.history.start();
        },

        movies: function() {
            this.trigger('viewChange', MoviesView);
        },

        series: function() {
            this.trigger('viewChange', SeriesView);
        },

        music: function() {
            this.trigger('viewChange', MusicView);
        },

        musicBrowse: function() {
            this.trigger('viewChange', MusicBrowseView);
        },

        musicBrowseCategory: function(id) {
            this.trigger('viewChange', MusicBrowseCategoryView, {id: id});
        },

        musicBrowseArtist: function(id) {
            this.trigger('viewChange', MusicBrowseArtistView, {id: id});
        },

        musicBrowseAlbum: function(id) {
            this.trigger('viewChange', MusicBrowseAlbumView, {id: id});
        },

        musicRadio: function(filter) {
            this.trigger('viewChange', MusicRadioView, {filter: filter});
        },

        musicSearch: function(query) {
            this.trigger('viewChange', MusicSearchView, {query: query});
        },

        photos: function() {
            this.trigger('viewChange', PhotosView);
        },

        error: function() {
            this.navigate('!/404', {
                replace: true
            });
            this.trigger('viewChange', ErrorView);
        }
    });

    return Router;
});
