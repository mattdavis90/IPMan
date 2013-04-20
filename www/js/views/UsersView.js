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
  }
});