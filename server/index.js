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

//app.get('/api/movies', routes.movies.getMovies);
//
//app.get('/api/series', routes.series.getSeries);
//app.get('/api/series/:id/episodes', routes.series.getEpisodes);
//
//app.get('/api/search/movies', routes.search.movies);
//app.get('/api/search/series', routes.search.series);
//app.get('/api/search/music', routes.search.music);
//app.get('/api/search/downloads', routes.search.downloads);
//
app.get('/api/radio/stations', routes.radio.getStations);
app.get('/api/radio/stations/:id', routes.radio.getStation);
app.get('/api/radio/categories', routes.radio.getCategories);
app.get('/api/radio/countries', routes.radio.getCountries);
app.get('/api/radio/pinned', routes.radio.getPinned);
app.get('/api/radio/search/:query', routes.radio.getSearch);

app.get('/api/spotify/my-playlists', routes.spotify.getMyPlaylists);
app.get('/api/spotify/my-tracks', routes.spotify.getMyTracks);
app.get('/api/spotify/categories', routes.spotify.getCategories);
app.get('/api/spotify/categories/:id', routes.spotify.getCategoryPlaylists);
app.get('/api/spotify/featured-playlists', routes.spotify.getFeaturedPlaylists);
app.get('/api/spotify/tracks/:id', routes.spotify.getTrack);
app.get('/api/spotify/artists/:id', routes.spotify.getArtist);
app.get('/api/spotify/artists/:id/albums', routes.spotify.getArtistAlbums);
app.get('/api/spotify/artists/:id/tracks', routes.spotify.getArtistTopTracks);
app.get('/api/spotify/albums/:id', routes.spotify.getAlbum);
app.get('/api/spotify/albums/:id/tracks', routes.spotify.getAlbumTracks);
app.get('/api/spotify/playlists/:uri', routes.spotify.getPlaylist);
app.get('/api/spotify/playlists/:uri/tracks', routes.spotify.getPlaylistTracks);
app.get('/api/spotify/search/:query', routes.spotify.getSearch);

app.get('/api/player/status', function(req, res, next) {
    res.send(player.getStatus());
});

// TODO: remove REST player endpoints when testing phase is done
app.get('/api/player/open', function(req, res, next) {
    player.open(req.query.type, req.query.id);
    res.status(200).end();
});
app.get('/api/player/toggle', function(req, res, next) {
    player.toggle();
    res.status(200).end();
});
app.get('/api/player/next', function(req, res, next) {
    player.next();
    res.status(200).end();
});
app.get('/api/player/previous', function(req, res, next) {
    player.previous();
    res.status(200).end();
});
app.get('/api/player/shuffle', function(req, res, next) {
    player.shuffle();
    res.status(200).end();
});
app.get('/api/player/repeat', function(req, res, next) {
    player.repeat();
    res.status(200).end();
});
app.get('/api/player/stop', function(req, res, next) {
    player.stop();
    res.status(200).end();
});
app.get('/api/player/seek', function(req, res, next) {
    player.seek(req.query.ms);
    res.status(200).end();
});

app.use('/', express.static(__dirname + '/../public/dist'));
app.use('/radio-posters', express.static(__dirname + '/data/radio-posters'));

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
            player[func].apply(player, data.parameters);
        }
    });
});

server.listen(process.env.PORT || 5000, function() {
    console.log("Express server listening on port %d", server.address().port);
});
