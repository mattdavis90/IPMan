window.UsersView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
    this.users = new Users();
  },

  render: function () {
    var self = this;

    headerView.select(this.menuClass);

    this.users.fetch({
      success: function(users) {
        var html = _.template(self.template, {users: users.models});
        self.$el.html(html);
      }
    });
  },

  events: {
    "submit .user-form": "newUser",
    "click .btn-delete": "removeUser"
  },

  newUser: function(event) {
    var self = this;
    
    utils.formToJSON(event.currentTarget, function(user) {
      var userModel = new User();

      userModel.save(user, {
        success: function(model, response, options) {
          if(response.error) {
            self.showError(response.error);
          } else {
            self.render();
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

  removeUser: function(event) {
    var self = this;

    var id = event.currentTarget.value;
    var user = this.users.get(id);

    yesNoView.show("Are you sure?", "Are you sure you want to remove the user '" + user.get("username") + "'?", {
      yes: function() {
        user.destroy({
          success: function(model, response) {
            self.render();
          }
        });
      }
    });
  },
  
  showError: function(error) {
    $('.user-error').html(error).show();
  }
});