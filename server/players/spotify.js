var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var spop = require('node-spop');

var config = require('./../config');

var instance;

function parseUri(uri) {
    var parts = uri.split(':');

    // remove the spotify part
    parts.shift();

    if(parts.length > 2 && parts[0] === 'user' && parts[2] === 'playlist') {
        return {
            type: parts[2],
            id: parts[3]
        };
    } else {
        return {
            type: parts[0],
            id: parts[1]
        };
    }
}

var status = {
    playlistUri: null,
    trackId: null,
    duration: 0,
    position: 0,
    shuffle: false,
    repeat: false,
    state: 'idle'
};

function resetStatus() {
    status.playlistUri = null;
    status.trackId = null;
    status.duration = 0;
    status.position = 0;
    status.state = 'idle';
}

function setStatus(data) {
    if(_.isString(data)) {
        return;
    }

    if(data.status) {
        if(data.status === 'stopped') {
            resetStatus();
        } else {
            status.state = data.status;
        }
    }

    if(data.uri) {
        var uri = parseUri(data.uri);
        if(uri.type === 'track') {
            status.trackId = uri.id;
        }
    }

    function trySetting(key) {
        if(data[key]) {
            status[key] = data[key];
        }
    }

    trySetting('duration');
    trySetting('position');
    trySetting('shuffle');
    trySetting('repeat');

    instance.emit('status', status);
}

var SpotifyPlayer = function() {
    spop.setup({
        host: config.spotify.host,
        port: config.spotify.port
    }).then(function() {
        this.ready = true;
        this.emit('ready');
    }.bind(this), function(error) {
        console.error('Error connecting to spop server.', error);
    });

    EventEmitter.call(this);
};

util.inherits(SpotifyPlayer, EventEmitter);

SpotifyPlayer.prototype.open = function(id) {
    var uri = parseUri(id);

    resetStatus();

    if(this.ready) {
        if(uri.type === 'artist') {
            // fetch all artist albums from spotify api and uplay + uadd them to spop
        } else if(uri.type === 'track') {
            // fetch track data and use its first album field as playlistUri
        } else {
            if(uri.type === 'playlist' || uri.type === 'album') {
                status.playlistUri = id;
            }

            return spop.uplay(id).then(function(status) {
                setStatus(status);
            }, function(error) {
                console.error('SPOP= Failed opening ' + uri.id, error);
            });
        }
    }
};

SpotifyPlayer.prototype.toggle = function() {
    return spop.pause().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.stop = function() {
    return spop.stop().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.next = function() {
    return spop.next().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.previous = function() {
    return spop.prev().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.shuffle = function() {
    return spop.shuffle().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.repeat = function() {
    return spop.repeat().then(function(status) {
        setStatus(status);
    });
};

SpotifyPlayer.prototype.seek = function(ms) {
    return spop.seek(ms).then(function(status) {
        setStatus(status);
    });
};

instance = new SpotifyPlayer();

module.exports = instance;
