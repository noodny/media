define([
    'views/search',
    'views/music/lists/playlists',
    'views/music/lists/categories',
    'text!templates/music/browse.html'
], function(SearchView, PlaylistsView, CategoriesView, template) {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(_.template(template));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            this.playlistsView = new PlaylistsView({
                elements: [],
                type: 'featured',
                el: this.$('.view-playlists'),
                layout: 'slider'
            });
            this.listenToOnce(this.playlistsView, 'fetch-success', function(data) {
                if(data && data.message) {
                    this.$('.featured-playlists-message').text(data.message);
                }
            }.bind(this));
            this.playlistsView.render();

            this.categoriesView = new CategoriesView({
                elements: [],
                el: this.$('.view-categories')
            });
            this.categoriesView.render();
        }
    });

    return View;
});
