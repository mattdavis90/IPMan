window.HomeView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    this.model = new Login();

    _.bindAll(this, "render");
    session.bind('change', this.render);
  },

  render: function () {
    var self = this;

    utils.checkAuth(this.accessLevel, function() {
      headerView.select(self.menuClass);

      var html = _.template(self.template, {header: "Home", session: session.toJSON()});
      self.$el.html(html);
    });
  },

  events: {
    "change .login-form": "change",
    "submit .login-form": "login"
  },

  change: function(event) {
    this.hideError();

    var target = event.target;
    var tmp = {};

    tmp[target.name] = target.value;
    this.model.set(tmp);
  },

  login: function(event) {
    event.preventDefault();

    var self = this;

    this.model.save({}, {
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
  },

  showError: function(error) {
    $('.login-error').html(error).show();
  }, 

  hideError: function() {
    $('.login-error').hide();
  }
});