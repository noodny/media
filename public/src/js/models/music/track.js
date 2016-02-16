define([
    'utils/date'
], function(date) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: null,
            mdbId: null,
            title: null
        },

        getDuration: function() {
            return date.formatDuration(this.get('duration_ms') / 1000);
        }
    });

    return Model;
});
