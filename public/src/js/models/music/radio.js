define([
], function() {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            title: null,
            urls: null,
            pinned: null
        }
    });

    return Model;
});
