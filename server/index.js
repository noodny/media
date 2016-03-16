var express = require('express');
var parser = require('body-parser');
var cors = require('cors');
var socket = require('socket.io');
var requireDir = require('require-dir');
var http = require('http');

var player = require('./player');
var middlewares = require('./middlewares');

var app = express();

var routes = requireDir('./routes');

app.use(cors());
app.use(parser.json());

//app.get('/movies', routes.movies.getMovies);
//
//app.get('/series', routes.series.getSeries);
//app.get('/series/:id/episodes', routes.series.getEpisodes);
//
//app.get('/search/movies', routes.search.movies);
//app.get('/search/series', routes.search.series);
//app.get('/search/music', routes.search.music);
//app.get('/search/downloads', routes.search.downloads);
//
//app.get('/radio/stations', routes.radio.getStations);
//app.get('/radio/genres', routes.radio.getGenres);
//app.get('/radio/countries', routes.radio.getCountries);
//app.get('/radio/starred', routes.radio.getStarred);
//
//app.get('/player/status', routes.player.getStatus);
//app.get('/player/features', routes.player.getFeatures);

app.get('/spotify/my-playlists', routes.spotify.getMyPlaylists);
app.get('/spotify/my-tracks', routes.spotify.getMyTracks);
app.get('/spotify/categories', routes.spotify.getCategories);
app.get('/spotify/categories/:id', routes.spotify.getCategoryPlaylists);
app.get('/spotify/featured-playlists', routes.spotify.getFeaturedPlaylists);
app.get('/spotify/tracks/:id', routes.spotify.getTrack);
app.get('/spotify/artists/:id', routes.spotify.getArtist);
app.get('/spotify/artists/:id/albums', routes.spotify.getArtistAlbums);
app.get('/spotify/artists/:id/tracks', routes.spotify.getArtistTopTracks);
app.get('/spotify/albums/:id', routes.spotify.getAlbum);
app.get('/spotify/albums/:id/tracks', routes.spotify.getAlbumTracks);
app.get('/spotify/playlists/:uri', routes.spotify.getPlaylist);

app.get('/player/status', function(req, res, next) {
    res.send(player.getStatus());
});

// TODO: remove REST player endpoints when testing phase is done
app.get('/player/open', function(req, res, next) {
    player.open(req.query.type, req.query.id);
    res.status(200).end();
});
app.get('/player/toggle', function(req, res, next) {
    player.toggle();
    res.status(200).end();
});
app.get('/player/next', function(req, res, next) {
    player.next();
    res.status(200).end();
});
app.get('/player/previous', function(req, res, next) {
    player.previous();
    res.status(200).end();
});
app.get('/player/shuffle', function(req, res, next) {
    player.shuffle();
    res.status(200).end();
});
app.get('/player/repeat', function(req, res, next) {
    player.repeat();
    res.status(200).end();
});
app.get('/player/stop', function(req, res, next) {
    player.stop();
    res.status(200).end();
});
app.get('/player/seek', function(req, res, next) {
    player.seek(req.query.ms);
    res.status(200).end();
});

app.post('/download');

if(process.env.NODE_ENV !== 'production') {
    app.use(middlewares.logRequest);
}

app.use(middlewares.clientError);
app.use(middlewares.serverError);

var server = http.createServer(app);
var io = socket(server);

// use io.emit(event) to send a message to all connected clients
player.on('status', function(data) {
    if(process.env.NODE_ENV !== 'production') {
        console.log('player:status', data);
    }
    io.emit('player:status', data);
});

player.on('time', function(data) {
    if(process.env.NODE_ENV !== 'production' && process.env.VERBOSE === true) {
        console.log('player:time', data);
    }
    io.emit('player:time', data);
});

// notify about download/watching progress
// io.emit('movie:status')
// io.emit('series:status')

io.on('connection', function(socket) {
    // use socket.emit(event) to send a message to the connected client
    // use socket.on(event) to listen to events from a client

    socket.on('player:open', function(data) {
        if(process.env.NODE_ENV !== 'production') {
            console.log('player:open', data);
        }

        player.open(data.type, data.id);
    });

    socket.on('player:command', function(data) {
        if(process.env.NODE_ENV !== 'production') {
            console.log('player:command', data);
        }

        if(player.hasFeature(data.command)) {
            var func = player.mapFeature(data.command);
            player[func](data.parameters);
        }
    });
});

server.listen(process.env.PORT || 5000, function() {
    console.log("Express server listening on port %d", server.address().port);
});
