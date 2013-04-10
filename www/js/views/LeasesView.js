window.LeasesView = Backbone.View.extend({
  el: "#content",

  initialize: function() {
    this.ipAddresses = new IPAddresses();
    this.leases = new Leases();
  },

  render: function() {
    var self = this;

    utils.checkAuth(this.accessLevel, function() {
      headerView.select(self.menuClass);
      
      self.ipAddresses.fetch({
        success: function(ipAddresses) {
          self.leases.fetch({
            success: function(leases) {
              var html = _.template(self.template, {ipAddresses: ipAddresses.models, leases: leases.models});
              self.$el.html(html);
            }
          });
        }
      });
    });
  },

  events: {
    "click .btn-release": "release"
  },

  release: function(event) {
    var self = this;

    var id = event.currentTarget.value;
    var lease = this.leases.get(id);

    lease.destroy({
      success: function(model, response) {
        // $(event.currentTarget).parents("tr").remove();
        self.render();
      }
    });
  }
});