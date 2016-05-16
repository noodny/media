define([
    'config',
    'models/music/playlist',
    'views/music/playlist'
], function(config, Album, PlaylistView) {
    var View = PlaylistView.extend({
        initialize: function(options, parameters) {
            if(parameters.id) {
                this.id = parameters.id;
            }
        },
        render: function() {
            if(!this.model) {
                this.model = new Album({
                    uri: this.id
                });
                this.model.fetch()
                    .done(this.render.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                PlaylistView.prototype.render.call(this);
            }
        },
        onFetchFailure: function() {
            console.error('AlbumView: failed fetching album model');
        }
    });

    return View;
});
