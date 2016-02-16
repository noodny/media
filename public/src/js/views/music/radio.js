define([
    'views/search',
    'text!templates/music/radio.html'
], function(SearchView, template) {
    var View = Backbone.View.extend({
        initialize: function() {
            console.log(arguments);
        },
        render: function() {
            this.$el.html(_.template(template, {

            }));

            this.searchView = new SearchView({
                el: this.$('.view-search-container')
            });
            this.searchView.render();
        }
    });

    return View;
});
