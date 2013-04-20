window.User = Backbone.Model.extend({
  urlRoot: "/api/users",

  idAttribute: "_id",

  validate: function(attrs, options) {
    var password = attrs.password;
    var passwordAgain = attrs.passwordAgain;

    if(password != passwordAgain) {
      return({"error": "Passwords must match"});
    }
  }
});