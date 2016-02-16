define([
    'views/movies',
    'views/series',
    'views/music',
    'views/music/radio',
    'views/music/browse',
    'views/photos',
    'views/error'
], function(MoviesView, SeriesView, MusicView, MusicRadioView, MusicBrowseView, PhotosView, ErrorView) {
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
            "!/music/radio(/:category)": "musicRadio",
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

        musicRadio: function(category) {
            this.trigger('viewChange', MusicRadioView, {category: category});
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
