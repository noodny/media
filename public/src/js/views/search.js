define([
    'text!templates/search.html'
], function(template) {
    var View = Backbone.View.extend({
        initialize: function(parameters) {
            if(parameters && parameters.type) {
                this.type = parameters.type;
            }
        },
        render: function() {
            this.$el.html(_.template(template));
        }
    });
    return View;
});
