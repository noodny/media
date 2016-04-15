define([
    'views/list',
    'collections/music/categories',
    'text!templates/music/lists/categories.html',
    'text!templates/music/lists/items/category.html'
], function(ListView, Collection, template, itemTemplate) {
    var View = ListView.extend({
        viewTemplate: template,
        itemTemplate: itemTemplate,

        initialize: function(options) {
            this.options = options;
            this.collection = new Collection(options.elements || []);
        }
    });

    return View;
});
