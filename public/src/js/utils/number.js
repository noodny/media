define([], function () {
    'use strict';
    var number = {};

    /**
     * Format number with leading 0 if lower than 10
     *
     * @param {int} number
     * @returns {string}
     */
    number.zeroPad = function(number) {
        number = parseInt(number, 10);
        return number < 10 ? '0' + number : number.toString();
    };

    /**
     * Formats big number to smaller form
     *
     * Example: formatNumberToShortForm(5880) returns "5,9k"
     *
     * @param {int} number
     * @returns {string|null}
     */
    number.toShortForm = function(number) {
        var i, formattedNumber,  thresholds = [{
            number: 1000000,
            form: 'm'
        }, {
            number: 1000,
            form: 'k'
        }];

        number = parseInt(number, 10);
        if (isNaN(number)) {
            return null;
        }

        formattedNumber = number.toString();
        for (i = 0; i < thresholds.length; i++) {
            if (number >= thresholds[i].number) {
                // using Math.round to workaround toFixed issues
                formattedNumber = (Math.round((number * 10 / thresholds[i].number)) / 10).toFixed(1);

                // If number ends with '.0' remove it
                if (/\.0$/.test(formattedNumber)) {
                    formattedNumber = formattedNumber.replace('.0', '');
                }

                formattedNumber += thresholds[i].form;
                break;
            }
        }

        number = formattedNumber.replace('.', ',');

        return number;
    };

    return number;
});
