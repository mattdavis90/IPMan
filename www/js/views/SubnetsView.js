window.SubnetsView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
  },

  render: function () {
    var html = _.template(this.template, {});
    this.$el.html(html);
  }
});