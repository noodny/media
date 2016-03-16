define([
    'config'
], function(config) {
    var Socket = {
        emit: function(event, data) {
            this.connection.emit(event, data);
        }
    };
    _.extend(Socket, Backbone.Events);

    Socket.initialize = function() {
        this.connection = io(config.apiUrl);

        var events = ['player:status', 'player:time'];

        _.each(events, function(event) {
            this.connection.on(event, function() {
                console.log('socket received event ' + event, arguments);
                this.trigger.apply(this, [event].concat(Array.prototype.slice.call(arguments)));
            }.bind(this));
        }.bind(this));
    };

    return Socket;
});
