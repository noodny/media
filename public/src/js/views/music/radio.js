define([
    'collections/music/radios',
    'collections/music/countries',
    'collections/music/genres',
    'views/search',
    'text!templates/music/radio.html',
    'text!templates/music/radios-list.html'
], function(RadiosCollection, CountriesCollection, GenresCollection, SearchView, template, radiosListTemplate) {
    var View = Backbone.View.extend({
        initialize: function(options, parameters) {
            if(parameters && parameters.category) {
                this.category = parameters.category;
            }
        },
        render: function() {
            if(this.category) {
                this.$el.html(_.template(radiosListTemplate, {
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
                    },{
                        id: 12,
                        name: 'RMF Classic',
                        image: 'http://cdn-radiotime-logos.tunein.com/s48202q.png',
                        stream: '',
                        categories: ['Classic', 'Oldies'],
                        starred: true
                    }, {
                        id: 23,
                        name: 'RMF Gold',
                        image: 'http://cdn-radiotime-logos.tunein.com/s76609q.png',
                        stream: '',
                        categories: ['Oldies'],
                        starred: true
                    },{
                        id: 14,
                        name: 'RMF Classic',
                        image: 'http://cdn-radiotime-logos.tunein.com/s48202q.png',
                        stream: '',
                        categories: ['Classic', 'Oldies'],
                        starred: true
                    }, {
                        id: 25,
                        name: 'RMF Gold',
                        image: 'http://cdn-radiotime-logos.tunein.com/s76609q.png',
                        stream: '',
                        categories: ['Oldies'],
                        starred: true
                    }], {parse: true})
                }));
            } else {
                this.$el.html(_.template(template, {
                    countries: new CountriesCollection(['Polska', 'Węgry', 'Czechy', 'Rosja'], {parse: true}),
                    genres: new GenresCollection(['Rock', 'Pop', 'Muzyka klasyczna', 'Jazz', 'Swing', 'Smooth Jazz'], {parse: true})
                }));
            }

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();
        }
    });

    return View;
});
