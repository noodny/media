define([], function () {
    'use strict';
    var prevViewportType,
        dimensions = {
            mobile: 320,
            smartphoneBig: 480,
            tablet: 641,
            tabletBig: 768,
            web: 1024,
            webBig: 1200
        },
        device = {};

    device.initialize = function(optDimensions) {
        var dimensionName, functionName;
        dimensions = optDimensions || dimensions;

        for (dimensionName in dimensions) {
            functionName = 'is' + dimensionName.charAt(0).toUpperCase() + dimensionName.slice(1) + 'Viewport';
            device[functionName] = this.isViewport.bind(null, dimensionName);
        }
    };

    device.getPixelRatio = _.memoize(function() {
        var devicePixelRatio;
        if (window.devicePixelRatio) {
            devicePixelRatio = window.devicePixelRatio;
            if (devicePixelRatio > 1) {
                devicePixelRatio = 2;
            } else {
                devicePixelRatio = 1;
            }
        } else if (device.isTouch() && window.innerWidth && window.screen && window.screen.width) {
            // (Math.round(X * 2 )/2) to make a step every 0.5 not 1
            devicePixelRatio = (Math.round(window.screen.width / window.innerWidth * 2) / 2);
        } else {
            devicePixelRatio = 1;
        }
        return devicePixelRatio;
    });

    device.getDeviceType = _.memoize(function() {
        return device.getPixelRatio() > 1 ? 'retina' : 'normal';
    });

    device.getOrientation = function() {
        var orientation;
        if (typeof window.orientation !== 'undefined') {
            orientation = (window.orientation === 90 || window.orientation === -90 ? 'landscape' : 'portrait');
        } else {
            orientation = (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        }

        return orientation;
    };

    device.isIOS = _.memoize(function() {
        return navigator.userAgent.match(/(iPad|iPhone|iPod)/i) === null ? false : true;
    });

    /* jshint maxlen: 300 */
    /* jscs: disable maximumLineLength */
    device.isMobile = _.memoize(function() {
        return navigator.userAgent.match(/(iPhone|iPod|Android(?=.*Mobile).*|HTC|Fennec|IEMobile|BlackBerry|SymbianOS(?=.*AppleWebKit).*|Opera Mobi|Symbian|SonyEricsson|Nokia|SAMSUNG|LG)/i) === null ? false : true;
    });
    /* jscs: enable maximumLineLength */

    device.isTouch = function() {
        return Modernizr.touch;
    };

    device.getViewportType = function() {
        var keys = _.keys(dimensions).reverse(),
            i, len;

        for (i = 0, len = keys.length; i < len; i++) {
            if (device.isViewport(keys[i])) {
                return keys[i];
            }
        }

        return 'mobile';
    };

    device.isViewportWidthGte = function(width) {
        return $(window).innerWidth() >= width ? true : false;
    };

    device.isViewport = function(type) {
        if (!dimensions[type]) {
            throw new Error('Viewport "' + type + '" doesn\'t exists');
        }

        return device.isViewportWidthGte(dimensions[type]);
    };

    device.viewport = {};
    prevViewportType = device.getViewportType();

    $(window).on('resize', function() {
        var currentViewportType = device.getViewportType();
        if (currentViewportType !== prevViewportType) {
            device.viewport.trigger('change', prevViewportType, currentViewportType);
            device.viewport.trigger(prevViewportType + 'Off', prevViewportType);
            device.viewport.trigger(currentViewportType + 'On', currentViewportType);
            prevViewportType = currentViewportType;
        }
    });

    _.extend(device.viewport, Backbone.Events);

    return device;
});
