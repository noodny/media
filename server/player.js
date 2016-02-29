var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');

var instance;

var features = [
    'toggle', 'next', 'previous',
    'seek', 'forward', 'rewind',
    'volume:up', 'volume:down', 'volume:set',
    'shuffle', 'repeat',
    'subtitles:next', 'subtitles:previous', 'subtitles:faster', 'subtitles:slower'
];

function mapFeature(feature) {
    // split by :, inverse words, capitalize first letter, e.g. subtitles:next -> nextSubtitles
    return _.chain(feature.split(':')).reverse().map(function(value, index) {
        if(index > 0) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        } else {
            return value;
        }
    }).value().join('');
}

function getFeatures(player) {
    var feats = [];
    _.each(features, function(feat) {
        var func = mapFeature(feat);
        if(_.isFunction(player[func])) {
            feats.push(feat);
        }
    });
    return feats;
}

function setStatus(data) {
    if(status.type === 'spotify') {
        _.each(data, function(value, key) {
            status[key] = value;
        });
    }

    instance.emit('status', status);
}

function resetStatus() {
    status = {
        type: null,
        state: 'idle'
    }
}

function getPlayer() {
    return players[status.type];
}

function setPlayer(type) {
    if(type !== status.type) {
        if(getPlayer()) {
            getPlayer().removeAllListeners();
            resetStatus();
        }

        status.type = type;

        getPlayer().on('status', setStatus);
    }
}

var players = {
    radio: require('./players/radio'),
    spotify: require('./players/spotify'),
    video: require('./players/video')
};

var playerFeatures = {
    radio: getFeatures(players.radio),
    spotify: getFeatures(players.spotify),
    video: getFeatures(players.video)
};

var status = {
    type: null,
    state: 'idle'
};

var Player = function() {
    EventEmitter.call(this);
};

util.inherits(Player, EventEmitter);

Player.prototype.open = function(type, id) {
    if(getPlayer()) {
        return new Promise(function(resolve, reject) {
            this.stop().then(function() {
                setPlayer(type);
                getPlayer().open(id).then(resolve, reject);
            });
        }.bind(this));
    } else {
        setPlayer(type);
        return getPlayer().open(id);
    }
};

Player.prototype.stop = function() {
    return getPlayer().stop();
};

Player.prototype.getFeatures = function() {
    if(!status.type) {
        return [];
    }
    return playerFeatures[status.type];
};

Player.prototype.hasFeature = function(feature) {
    if(!status.type) {
        return false;
    }
    return this.getFeatures().indexOf(feature) > -1;
};

_.each(features, function(feat) {
    var func = mapFeature(feat);

    Player.prototype[func] = function() {
        if(this.hasFeature(feat)) {
            var player = getPlayer();
            var args = Array.prototype.splice.call(arguments, 0);

            return player[func].apply(player, args);
        }
    };
});

instance = new Player();

module.exports = instance;
