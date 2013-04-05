window.UnderConstructionView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
  },

  render: function () {
    var html = _.template(this.template, {header: "Under Construction"});
    this.$el.html(html);

    return this;
  }
});