var _ = require('lodash');
var spotify = require('./../spotify');

function proxyRoute(name) {
    return function(req, res, next) {
        var options = {
            limit: req.query.limit,
            offset: req.query.offset
        };

        _.each(req.params, function(value, key) {
            options[key] = value;
        });

        _.each(req.query, function(value, key) {
            if(!options[key]) {
                options[key] = value;
            }
        });

        spotify[name](options).then(
            function(data) {
                res.status(200).send(data);
            },
            function(error) {
                if(error.code) {
                    res.status(error.code);
                } else {
                    res.status(501);
                }
                res.send(error);
            }
        );
    }
}

var routes = [
    'getFeaturedPlaylists', 'getCategories', 'getCategoryPlaylists',
    'getMyPlaylists', 'getMyTracks',
    'getCategories', 'getCategoryPlaylists',
    'getArtist', 'getArtistAlbums', 'getArtistTopTracks',
    'getAlbum', 'getAlbumTracks',
    'getPlaylist', 'getPlaylistTracks', 'getTrack',
    'getSearch'
];

var handlers = {};

_.each(routes, function(route) {
    handlers[route] = proxyRoute(route);
});

module.exports = handlers;
