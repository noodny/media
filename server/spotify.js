var request = require('request');
var _ = require('lodash');

var config = require('./config');

var apiUrl = 'https://api.spotify.com/v1/';
var authUrl = 'https://accounts.spotify.com/api/token';
var token = null;

var DEFAULT_LIMIT = config.spotify.limit || 20;

function authorize() {
    return new Promise(function(resolve, reject) {
        if(token) {
            return resolve(token);
        }

        var options = {
            url: authUrl,
            method: 'POST',
            auth: {
                user: config.spotify.clientId,
                pass: config.spotify.clientSecret
            },
            form: {
                refresh_token: config.spotify.authToken,
                grant_type: 'refresh_token'
            }
        };

        request(options, function(err, res, body) {
            try {
                body = JSON.parse(body);
            } catch (e) {

            }

            if(err || res.statusCode > 200 || body.error) {
                return reject({
                    message: err || body.error,
                    code: res.statusCode
                });
            }

            if(body.token_type && body.expires_in) {
                token = body;

                setTimeout(function() {
                    token = null;
                }, token.expires_in);
            }

            resolve(body);
        });
    });
}

function requestAuthorized(options) {
    return new Promise(function(resolve, reject) {
        authorize().then(function(token) {
            options = _.defaults(options, {
                baseUrl: apiUrl,
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            });

            request(options, function(err, res, body) {
                try {
                    body = JSON.parse(body);
                } catch (e) {

                }

                if(err || res.statusCode > 200 || body.error) {
                    return reject({
                        message: err || body.error,
                        code: res.statusCode
                    });
                }

                resolve(body);
            });
        }, reject);
    });
}

function parseUri(uri) {
    var parts = uri.split(':');

    if(parts[0] === 'spotify') {
        parts.shift();
    }

    if(parts.length > 2 && parts[0] === 'user' && parts[2] === 'playlist') {
        return {
            type: parts[2],
            id: parts[3],
            userId: parts[1]
        };
    } else {
        return {
            type: parts[0],
            id: parts[1]
        };
    }
}
// TODO: set shared query string paramaters in one place (country, default limit & offset)
module.exports = {
    parseUri: parseUri,
    getTrack: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'tracks/' + options.id,
            qs: {
                country: 'PL'
            }
        });
    },
    getFeaturedPlaylists: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'browse/featured-playlists',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    },
    getMyTracks: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'me/tracks',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    },
    getMyPlaylists: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'me/playlists',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    },
    getCategories: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'browse/categories',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL',
                locale: 'pl_PL'
            }
        });
    },
    getCategoryPlaylists: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'browse/categories/' + options.id + '/playlists',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    },
    getArtist: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'artists/' + options.id,
            qs: {
                country: 'PL'
            }
        });
    },
    getArtistAlbums: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'artists/' + options.id + '/albums',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL',
                market: 'PL',
                album_type: 'album,single'
            }
        });
    },
    getArtistTopTracks: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'artists/' + options.id + '/top-tracks',
            qs: {
                country: 'PL'
            }
        });
    },
    getAlbum: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'albums/' + options.id,
            qs: {
                country: 'PL'
            }
        });
    },
    getAlbumTracks: function(options) {
        options = options || {};

        return requestAuthorized({
            url: 'albums/' + options.id + '/tracks',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    },
    getPlaylist: function(options) {
        options = options || {};

        var uri = parseUri(options.uri);

        return requestAuthorized({
            url: 'users/' + uri.userId + '/playlists/' + uri.id,
            qs: {
                country: 'PL'
            }
        });
    },
    getPlaylistTracks: function(options) {
        options = options || {};

        var uri = parseUri(options.uri);

        return requestAuthorized({
            url: 'users/' + uri.userId + '/playlists/' + uri.id + '/tracks',
            qs: {
                limit: options.limit || DEFAULT_LIMIT,
                offset: options.offset || 0,
                country: 'PL'
            }
        });
    }
};
