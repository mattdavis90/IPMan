window.IPAddresses = Backbone.Collection.extend({
  url: "/api/ipAddresses",

  saveAll: function(callback) {
    var deferreds = [];
    
    $.each(this.models, function(index, model) {
      deferreds.push(model.save());
    });

    $.when.apply(null, deferreds).done(callback);
  }
});