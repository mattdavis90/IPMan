window.FooterView = Backbone.View.extend({
  el: ".footer",

  initialize: function () {
  },

  render: function () {
    var html = _.template(this.template, {});
    this.$el.html(html);

    return this;
  }
});