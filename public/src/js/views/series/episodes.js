define([
    'utils/device',
    'collections/episodes',
    'text!templates/series/episodes.html'
], function(device, EpisodesCollection, template) {
    var View = Backbone.View.extend({
        render: function() {
            this.collection = new EpisodesCollection([
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    watched: true,
                    hidden: false,
                    season: 1,
                    episode: 2
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    status: 'downloading',
                    progress: {
                        downloading: 0.5
                    },
                    watched: true,
                    hidden: false,
                    season: 1,
                    episode: 1
                },
                {
                    title: 'Skazani na Shawshank na Shawshank Shawshank',
                    duration: '2:22:00',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    status: 'playing',
                    progress: {
                        playing: 0.3
                    },
                    season: 1,
                    episode: 3
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    status: 'playing-paused',
                    progress: {
                        playing: 0.4
                    },
                    season: 2,
                    episode: 1
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    status: 'watched',
                    progress: {},
                    season: 2,
                    episode: 2
                }
            ], {parse: true});
            this.$el.html(_.template(template, {
                episodes: this.collection
            }));
            this.$items = this.$('.list-item-movie');
        }
    });

    return View;
});
