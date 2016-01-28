define([
    'views/movies',
    'views/series',
    'views/music',
    'views/photos',
    'views/error'
], function(MoviesView, SeriesView, MusicView, PhotosView, ErrorView) {
    var Router = Backbone.Router.extend({
        routes: {
            "": "movies",
            "!": "movies",
            "!/": "movies",
            "!/movies": "movies",
            "!/series": "series",
            "!/music": "music",
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
