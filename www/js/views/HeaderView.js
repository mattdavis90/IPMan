window.HeaderView = Backbone.View.extend({
  el: ".header",

  initialize: function () {
    _.bindAll(this, "render");
    session.bind('change', this.render);
    this.selectedItem = undefined;
  },

  render: function () {
    var accessLevel = session.get("accessLevel") || 0;
    var loggedIn = session.get("username") ? true : false;
    var html = _.template(this.template, {views: views, accessLevel: accessLevel, loggedIn: loggedIn});

    this.$el.html(html);

    if(this.selectedItem) {
      this.select(this.selectedItem);
    }

    return this;
  },

  events: {
    "click .btn-logout": "logout"
  },

  select: function(menuItem) {
    $('.nav li').removeClass('active');
    $('.' + menuItem).addClass('active');

    this.selectedItem = menuItem;
  },

  logout: function(event) {
    $.get('/api/logout', function(data) {
      if(data.error) {
        alert("Could not logout. Please contact your administrator.");
      } else {
        router.navigate('/');
        utils.refreshSession();
      }
    });
  }
});