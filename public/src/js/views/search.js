define([
    'application',
    'text!templates/search.html'
], function(Application, template) {
    var View = Backbone.View.extend({
        events: {
            'submit form': 'onFormSubmit'
        },
        initialize: function(parameters) {
            parameters = parameters || {};

            if(parameters.type) {
                this.type = parameters.type;
            }

            if(parameters.query) {
                this.query = parameters.query;
            }
        },
        render: function() {
            this.$el.html(_.template(template, {
                query: this.query
            }));
            this.$query = this.$('input[type="search"]');
        },
        getUrl: function() {
            switch (this.type) {
                case 'music':
                    return '#!/music/search/' + this.getQuery();
                    break;
                default:
                    return '#!/search/' + this.getQuery();
            }
        },
        getQuery: function() {
            return this.$query.val().trim();
        },
        onFormSubmit: function(event) {
            event.preventDefault();

            Application.router.navigate(this.getUrl(), {replace: true, trigger: true});
        }
    });
    return View;
});
