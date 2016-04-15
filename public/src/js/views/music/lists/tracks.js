define([
    'views/list',
    'collections/music/tracks',
    'text!templates/music/lists/tracks.html',
    'text!templates/music/lists/items/track.html'
], function(ListView, Collection, template, itemTemplate) {
    var View = ListView.extend({
        viewTemplate: template,
        itemTemplate: itemTemplate,
        initialize: function(options) {
            this.options = options;

            this.collection = new Collection(options.elements || [], {
                type: options.type || 'my'
            });
        }
    });

    return View;
});
