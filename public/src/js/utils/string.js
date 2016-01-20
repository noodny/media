define([], function () {
    'use strict';
    var string = {};

    /**
     * Remove all unsafe html characters
     *
     * @param {string} text
     * @returns {string}
     */
    string.stripTags = function(text) {
        return text.replace(/(<([^>]+)>)/ig, '');
    };

    /**
     * Removes new lines
     *
     * @param {string} text
     * @returns {string}
     */
    string.removeNewLines = function(text) {
        return text.replace(/(\r\n|\n|\r)/gm, '');
    };

    string.capitaliseFirstLetter = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Replace part of string
     * Replacements are decimal numbers in curly brackets starting from 0
     *
     * Example: sprintf("This {0} change", "will") returns "This will change
     *
     * @param {string} format
     * @returns {XML|*|string|void}
     */
    string.sprintf = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);

        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    return string;
});
