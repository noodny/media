define([
    'config',
    'models/music/album',
    'views/music/album'
], function(config, Album, AlbumView) {
    var View = AlbumView.extend({
        initialize: function(options, parameters) {
            if(parameters.id) {
                this.id = parameters.id;
            }
        },
        render: function() {
            if(!this.model) {
                this.model = new Album({
                    id: this.id
                });
                this.model.fetch()
                    .done(this.render.bind(this))
                    .fail(this.onFetchFailure.bind(this));
            } else {
                AlbumView.prototype.render.call(this);
            }
        },
        onFetchFailure: function() {
            console.error('AlbumView: failed fetching album model');
        }
    });

    return View;
});
