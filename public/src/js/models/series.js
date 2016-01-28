define([
], function() {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            mdbId: null,
            title: null
        }
    });

    return Model;
});
