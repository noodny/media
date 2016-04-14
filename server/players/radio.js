var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var async = require('async');
var spop = require('node-spop');

var config = require('./../config');
var MPlayer = require('mplayer');
var player = new MPlayer();

var low = require('lowdb');
var db = low(__dirname + '/../data/radio.json', {
    storage: require('lowdb/file-sync')
});

var instance;

var status = {
    id: null,
    state: 'idle'
};

function resetStatus() {
    status.id = null;
    status.state = 'idle';
}

function setStatus(data) {
    if(_.isString(data)) {
        return;
    }

    if(data.status) {
        status.state = data.status;
    } else {
        if(data.playing) {
            if(data.filename === null) {
                status.state = 'idle';
            } else {
                status.state = 'playing';
            }
        } else {
            if(data.filename) {
                status.state = 'idle';
            } else {
                resetStatus();
            }
        }
    }

    function trySetting(key) {
        if(typeof data[key] !== 'undefined') {
            status[key] = data[key];
        }
    }

    trySetting('id');
    trySetting('title');

    instance.emit('status', status);
}

var RadioPlayer = function() {
    // initialize the player
    // add status listeners
    player.on('status', setStatus);

    EventEmitter.call(this);
};

util.inherits(RadioPlayer, EventEmitter);

RadioPlayer.prototype.open = function(id) {
    if(id) {
        var station = db('stations').find({id: id});

        if(station) {
            var stream = _.find(station.streams, {type: 'MP3'});

            if(stream) {
                player.once('start', function() {
                    setStatus({
                        playing: true,
                        id: id
                    });
                });
                player.openPlaylist(stream.stream);
            }
        }
    }
};

RadioPlayer.prototype.toggle = function() {
    return new Promise(function(resolve, reject) {
        if(status.state === 'playing') {
            player.once('pause', resolve);
            setStatus({
                status: 'paused'
            });
            player.pause();
        } else if(status.state === 'paused') {
            player.once('play', resolve);
            setStatus({
                status: 'playing'
            });
            player.play();
        }
    });
};

RadioPlayer.prototype.stop = function() {
    return new Promise(function(resolve, reject) {
        player.once('stop', resolve);
        resetStatus();
        player.stop();
        setTimeout(resolve, 300);
    });
};

instance = new RadioPlayer();

module.exports = instance;
