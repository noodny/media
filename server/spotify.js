var request = require('request');
var _ = require('lodash');

var config = require('./config');

var apiUrl = 'https://api.spotify.com/v1/';
var authUrl = 'https://accounts.spotify.com/api/token';
var token = null;

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
                return reject(err || body.error || res.statusCode);
            }

            if(body.token_type && body.expires_in) {
                token = body;

                setTimeout(function() {
                    token = null;
                }, token.expires_in);

                if(body.refresh_token) {
                    config.spotify.authCode = body.refresh_token;
                    console.log(body.refresh_token);
                }
            }

            resolve(body);
        });
    });
}

function requestAuthorized(options) {
    return authorize().then(function(token) {
        options = _.defaults(options, {
            baseUrl: apiUrl,
            headers: {
                'Authorization': token.token_type + ' ' + token.access_token
            }
        });

        return new Promise(function(resolve, reject) {
            request(options, function(err, res, body) {
                try {
                    body = JSON.parse(body);
                } catch (e) {

                }

                if(err || res.statusCode > 200 || body.error) {
                    return reject(err || body.error || res.statusCode);
                }

                resolve(body);
            });
        });
    }, function(error) {
        console.error('authentication failed: ', error);
    });
}

function getFeaturedPlaylists() {
    return requestAuthorized({
        url: 'browse/featured-playlists',
        qs: {
            limit: 20,
            country: 'PL'
        }
    });
}

getFeaturedPlaylists().then(function(data) {
    console.log(data)
}, function() {
    console.log(arguments)
});
