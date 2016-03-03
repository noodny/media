define([
    'collections/music/categories',
    'text!templates/music/lists/categories.html',
    'text!templates/music/lists/items/category.html'
], function(Collection, template, itemTemplate) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            this.options = options;

            this.collection = new Collection(options.elements || []);
        },
        render: function() {
            this.$el.html(template);

            if(!this.options.fetched) {
                this.collection.fetch()
                    .done(this.onFetchSuccess.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                this.renderItems();
            }
        },
        renderItems: function() {
            var html = '';

            this.collection.each(function(item) {
                html += _.template(itemTemplate, {category: item});
            });

            this.$('.items-list').html(html).addClass('loaded');
        },
        onFetchSuccess: function(data) {
            this.renderItems();
        },
        onFetchFailure: function() {
            console.error('CategoriesView: failed fetching playlist collection')
        }
    });

    return View;
});
