window.UsersView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
  },

  render: function () {
    headerView.select(self.menuClass);

    var html = _.template(this.template, {});
    this.$el.html(html);
  }
});