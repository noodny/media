define([
    'collections/music/radio/stations',
    'collections/music/radio/countries',
    'collections/music/radio/categories',
    'views/search',
    'text!templates/music/radio.html',
    'text!templates/music/browse/stations.html',
    'text!templates/music/lists/items/station.html'
], function(StationsCollection, CountriesCollection, CategoriesCollection, SearchView, template, radiosListTemplate, stationTemplate) {
    var View = Backbone.View.extend({
        initialize: function(options, parameters) {
            if(parameters && parameters.filter) {
                this.filter = parameters.filter;
            }
        },
        render: function() {
            if(this.filter) {
                this.$el.html(_.template(radiosListTemplate));

                this.$stations = this.$('.stations-list');

                var filter = {};

                if(this.filter.indexOf('category') === 0) {
                    filter.category = this.filter.replace('category-', '');
                }

                if(this.filter.indexOf('country') === 0) {
                    filter.country = this.filter.replace('country-', '');
                }

                this.stations = new StationsCollection([], {
                    fetch: filter
                });

                this.stations.fetch().done(this.onStationsFetchSuccess.bind(this));
            } else {
                this.$el.html(_.template(template));

                this.countries = new CountriesCollection();
                this.categories = new CategoriesCollection();

                this.$countries = this.$('.radio-countries-list');
                this.$categories = this.$('.radio-categories-list');

                $.when(this.countries.fetch(), this.categories.fetch()).done(this.onRadioMetaFetch.bind(this))
            }

            this.searchView = new SearchView({
                el: this.$('.view-search-container'),
                type: 'music'
            });
            this.searchView.render();
        },
        onRadioMetaFetch: function() {
            var categories = '';
            this.categories.each(function(category) {
                categories += '<li class="list-item list-item-category"><a href="#!/music/radio/category-' + category.get('id') + '">' + category.get('name') + '</a></li>';
            });
            this.$categories.html(categories).addClass('loaded');

            var countries = '';
            this.countries.each(function(country) {
                countries += '<li class="list-item list-item-country"><a href="#!/music/radio/country-' + country.get('id') + '">' + country.get('name') + '</a></li>';
            });
            this.$countries.html(countries).addClass('loaded');
        },
        onStationsFetchSuccess: function() {
            var html = '';

            this.stations.each(function(station) {
                html += _.template(stationTemplate, {
                    model: station
                });
            });

            this.$stations.html(html).addClass('loaded');
        }
    });

    return View;
});
