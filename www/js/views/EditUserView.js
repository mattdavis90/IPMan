window.EditUserView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
  },

  render: function () {
    var html = _.template(this.template, {session: session});
    this.$el.html(html);
  },

  events: {
    "submit .edit-user-form": "editUser"
  },

  editUser: function(event) {
    var self = this;

    utils.formToJSON(event.currentTarget, function(user) {
      user['_id'] = 0; // Force Backbone to do a PUT no a POST

      var userModel = new User();

      userModel.save(user, {
        success: function(model, response, options) {
          if(response.error) {
            self.showError(response.error);
          } else {
            router.navigate('/');
            utils.refreshSession();
          }
        }, 

        error: function(model, xhr, options) {
          if(xhr.error) {
            self.showError(xhr.error);
          } else {
            self.showError("Could not contact server");
          }
        }
      });
    });

    event.preventDefault();
  },
  
  showError: function(error) {
    $('.edit-user-error').html(error).show();
  }
});