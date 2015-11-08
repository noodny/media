define([
    'text!templates/layout/header.html'
], function(template) {
    var View = Backbone.View.extend({
        render: function() {
            this.$el.html(_.template(template));
        }
    });

    return View;
});
