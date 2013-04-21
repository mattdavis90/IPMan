window.HomeView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    this.model = new Login();

    _.bindAll(this, "render");
    session.bind('change', this.render);
  },

  render: function () {
    headerView.select(this.menuClass);

    var html = _.template(this.template, {header: "Home", session: session.toJSON()});
    this.$el.html(html);
  },

  events: {
    "submit .login-form": "login"
  },

  login: function(event) {
    var self = this;
    
    utils.formToJSON(event.currentTarget, function(user) {
      self.model.save(user, {
        success: function(model, response, options) {
          if(response.error) {
            self.showError(response.error);
          } else {
            utils.refreshSession();
          }
        }, 

        error: function(model, xhr, options) {
          self.showError("Could not contact server");
        }
      });
    });

    event.preventDefault();
  },

  showError: function(error) {
    $('.login-error').html(error).show();
  }, 

  hideError: function() {
    $('.login-error').hide();
  }
});