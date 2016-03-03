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
            var parts = route.split(/[A-Z]/);

            var $active = this.$items.removeClass('active').removeClass('nested')
                .filter('[data-route="' + parts[0] + '"]').addClass('active');

            if(parts[1]) {
                $active.addClass('nested');
            }
        }
    });

    return View;
});
