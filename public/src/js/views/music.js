define([
    'utils/device',
    'views/search',
    'views/music/your',
    'text!templates/music.html'
], function(device, SearchView, YourMusicView, template) {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(_.template(template));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();

            this.subview = new YourMusicView({
                el: this.$('.view-your-music-container')
            });
            this.subview.render();
        }
    });

    return View;
});
