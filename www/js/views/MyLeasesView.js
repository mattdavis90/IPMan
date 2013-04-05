window.MyLeasesView = Backbone.View.extend({
  el: "#content",

  initialize: function() {
  },

  render: function() {
    var self = this;
    var leases = new Leases();

    leases.fetch({
      success: function(leases) {
        var html = _.template(self.template, {leases: leases.models});
        self.$el.html(html);
      }
    });
  }
});