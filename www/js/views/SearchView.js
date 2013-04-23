window.SearchView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
    this.ipAddresses = new IPAddresses();
  },

  render: function () {
    var self = this;
    
    headerView.select(this.menuClass);

    this.ipAddresses.fetch({
      success: function(ipAddresses) {
        var html = _.template(self.template, {
          ipAddresses: ipAddresses.models
        });

        self.$el.html(html);

        $('#search-table').dataTable();
      }
    });
  }
});