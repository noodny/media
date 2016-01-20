define([
    'text!templates/layout/header.html'
], function(template) {
    var View = Backbone.View.extend({
        events: {
            'click .header-item': 'onItemClick'
        },
        initialize: function() {
            this.listenTo(this, 'routeChange', this.onRouteChange.bind(this));
        },
        render: function() {
            this.$el.html(_.template(template));
            this.$items = this.$('.header-item');
        },
        onRouteChange: function(route) {
            this.$items.removeClass('active')
                .filter('[data-route="' + route + '"]').addClass('active');
        }
    });

    return View;
});
