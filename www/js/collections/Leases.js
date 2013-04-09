window.Leases = Backbone.Collection.extend({
  url: "/api/leases",

  model: Lease
});