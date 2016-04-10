define([
    'views/search',
    'views/music/lists/playlists',
    'views/music/lists/tracks',
    'collections/music/radio/stations',
    'text!templates/music.html',
    'text!templates/music/lists/items/station.html'
], function(SearchView, PlaylistsView, TracksView, StationsCollection, template, stationTemplate) {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(_.template(template));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            this.playlistsView = new PlaylistsView({
                elements: [],
                type: 'my',
                el: this.$('.view-playlists')
            });
            this.playlistsView.render();

            this.tracksView = new TracksView({
                elements: [],
                type: 'my',
                el: this.$('.view-tracks')
            });
            this.tracksView.render();

            this.stations = new StationsCollection([], {
                fetch: {
                    pinned: true
                }
            });
            this.$stations = this.$('.stations-list');
            this.stations.fetch().done(this.onStationsFetchSuccess.bind(this));
        },
        onStationsFetchSuccess: function() {
            var html = '';

            this.stations.each(function(station) {
                html += _.template(stationTemplate, {
                    station: station
                });
            });

            this.$stations.html(html).addClass('loaded');
        }
    });

    return View;
});
