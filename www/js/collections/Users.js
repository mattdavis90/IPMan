window.Users = Backbone.Collection.extend({
  url: "/api/users",

  model: User
});