define([
    'collections/movies',
    'text!templates/movies.html'
], function(MoviesCollection, template) {
    var View = Backbone.View.extend({
        events: {
            'click .list-item-movie': 'onListItemClick'
        },
        render: function() {
            this.collection = new MoviesCollection([
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    description: 'Adaptacja opowiadania Stephena Kinga. Historia niesłusznie skazanego na dożywocie bankiera, który musi przeżyć w brutalnym świecie rządzonym przez strażników i współwięźniów.',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    rating: '8,8'
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    description: 'Adaptacja opowiadania Stephena Kinga. Historia niesłusznie skazanego na dożywocie bankiera, który musi przeżyć w brutalnym świecie rządzonym przez strażników i współwięźniów.',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    rating: '8,8',
                    status: 'downloading',
                    progress: {
                        downloading: 0.5
                    }
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    description: 'Adaptacja opowiadania Stephena Kinga. Historia niesłusznie skazanego na dożywocie bankiera, który musi przeżyć w brutalnym świecie rządzonym przez strażników i współwięźniów.',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    rating: '8,8',
                    status: 'playing',
                    progress: {
                        playing: 0.3
                    }
                },
                {
                    title: 'Skazani na Shawshank',
                    duration: '2:22:00',
                    description: 'Adaptacja opowiadania Stephena Kinga. Historia niesłusznie skazanego na dożywocie bankiera, który musi przeżyć w brutalnym świecie rządzonym przez strażników i współwięźniów.',
                    image: 'http://1.fwcdn.pl/po/10/48/1048/6925401.3.jpg',
                    rating: '8,8',
                    status: 'playing-paused',
                    progress: {
                        playing: 0.4
                    }
                }
            ], {parse: true});
            this.$el.html(_.template(template, {
                movies: this.collection
            }));
            this.$items = this.$('.list-item-movie');
        },
        onListItemClick: function(event) {
            event.preventDefault();

            var $el = $(event.currentTarget);

            this.$items.not($el).removeClass('active');
            $el.toggleClass('active');
        }
    });

    return View;
});
