define([
    'views/search',
    'views/music/lists/playlists',
    'text!templates/music/browse/category.html'
], function(SearchView, PlaylistsView, template) {
    var View = Backbone.View.extend({
        initialize: function(options, parameters) {
            if(parameters && parameters.id) {
                this.id = parameters.id;
            } else {
                // TODO: redirect to 404
            }
        },
        render: function() {
            this.$el.html(_.template(template));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            this.playlistsView = new PlaylistsView({
                elements: [],
                type: 'category-' + this.id,
                el: this.$('.view-playlists'),
                layout: 'grid'
            });
            this.playlistsView.render();
        }
    });

    return View;
});
