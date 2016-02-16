define([
    'views/search',
    'collections/music/radios',
    'collections/music/playlists',
    'collections/music/tracks',
    'text!templates/music.html'
], function(SearchView, RadiosCollection, PlaylistsCollection, TracksCollection, template) {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(_.template(template, {
                radios: new RadiosCollection([{
                    id: 1,
                    name: 'RMF Classic',
                    image: 'http://cdn-radiotime-logos.tunein.com/s48202q.png',
                    stream: '',
                    categories: ['Classic', 'Oldies'],
                    starred: true
                }, {
                    id: 2,
                    name: 'RMF Gold',
                    image: 'http://cdn-radiotime-logos.tunein.com/s76609q.png',
                    stream: '',
                    categories: ['Oldies'],
                    starred: true
                }], {parse: true}),
                playlists: new PlaylistsCollection([{
                    id: 'spotify:playlist:dasdas',
                    name: 'Relax & Unwind',
                    image: 'https://d3rt1990lpmkn.cloudfront.net/640/b60b3ed2235fc72eb32eff8166d938d8522bd7b1',
                    starred: true
                }, {
                    id: 2,
                    name: 'RMF Gold',
                    image: 'http://cdn-radiotime-logos.tunein.com/s76609q.png',
                    starred: true
                }], {parse: true}),
                tracks: new TracksCollection([{
                    id: '2TpxZ7JUBn3uw46aR7qd6V',
                    uri: 'spotify:track:2TpxZ7JUBn3uw46aR7qd6V',
                    name: 'All I Want',
                    duration_ms: 276773,
                    starred: true,
                    artists: [{
                        "id": "08td7MxkoHQkXnWAYD8d6Q",
                        "name": "Tania Bowra",
                        "type": "artist",
                        "uri": "spotify:artist:08td7MxkoHQkXnWAYD8d6Q"
                    }, {
                        "id": "08td7MxkoHQkXnWAYD8d6Q",
                        "name": "Tania Bowra",
                        "type": "artist",
                        "uri": "spotify:artist:08td7MxkoHQkXnWAYD8d6Q"
                    }]
                }, {
                    id: '2TpxZ7JUBn3uw46aR7qdV',
                    uri: 'spotify:track:2TpxZ7JUBn3uw46aR7qd6V',
                    name: 'All I Want',
                    duration_ms: 276773,
                    starred: true,
                    artists: [{
                        "id": "08td7MxkoHQkXnWAYD8d6Q",
                        "name": "Tania Bowra",
                        "type": "artist",
                        "uri": "spotify:artist:08td7MxkoHQkXnWAYD8d6Q"
                    }, {
                        "id": "08td7MxkoHQkXnWAYD8d6Q",
                        "name": "Tania Bowra",
                        "type": "artist",
                        "uri": "spotify:artist:08td7MxkoHQkXnWAYD8d6Q"
                    }]
                }], {parse: true})
            }));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();
        }
    });

    return View;
});
