define([
    'utils/number'
], function (number) {
    'use strict';
    var date = {};

    date.formatDate = function(date) {
        return number.zeroPad(date.getDate()) + '.' + number.zeroPad(date.getMonth() + 1) + '.' + date.getFullYear();
    };

    date.formatTime = function(date) {
        return number.zeroPad(date.getHours()) + ':' + number.zeroPad(date.getMinutes());
    };

    date.formatDateTime = function(dateParam) {
        return date.formatDate(dateParam) + ' ' + date.formatTime(dateParam);
    };

    date.formatDuration = function(duration) {
        var minutes =  Math.floor((duration % 3600) / 60),
            seconds = duration % 60;

        return minutes + ':' + number.zeroPad(seconds);
    };

    return date;
});
