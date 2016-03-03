define([
    'views/search',
    'views/music/lists/playlists',
    'views/music/lists/tracks',
    'text!templates/music.html'
], function(SearchView, PlaylistsView, TracksView, template) {
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

            //this.radios = new RadiosCollection([{
            //    id: 1,
            //    name: 'RMF Classic',
            //    image: 'http://cdn-radiotime-logos.tunein.com/s48202q.png',
            //    stream: '',
            //    categories: ['Classic', 'Oldies'],
            //    starred: true
            //}, {
            //    id: 2,
            //    name: 'RMF Gold',
            //    image: 'http://cdn-radiotime-logos.tunein.com/s76609q.png',
            //    stream: '',
            //    categories: ['Oldies'],
            //    starred: true
            //}], {parse: true});
        }
    });

    return View;
});
