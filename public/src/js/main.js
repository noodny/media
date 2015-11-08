define([
    'application',
    'router'
], function(Application, Router) {
    var tmp = _.template;

    _.template = function(template, options) {
        var compiled = tmp(template);
        return compiled(options);
    };

    Application.initialize(new Router());
});
