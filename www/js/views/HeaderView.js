window.HeaderView = Backbone.View.extend({
  el: ".header",

  initialize: function () {
  },

  render: function () {
    var html = _.template(this.template, {});
    this.$el.html(html);

    return this;
  },

  select: function(menuItem) {
    $('.nav li').removeClass('active');
    $('.' + menuItem).addClass('active');
  }
});