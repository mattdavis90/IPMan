window.HeaderView = Backbone.View.extend({
  el: ".header",

  initialize: function () {
    session.bind('change', this.render, this);

    this.selectedItem = undefined;
  },

  render: function () {
    var accessLevel = session.get("accessLevel") || 0;
    var name = session.get("name");
    var loggedIn = name ? true : false;

    var user = {
      accessLevel: accessLevel,
      loggedIn: loggedIn,
      name: name
    }

    var html = _.template(this.template, {views: views, user: user});

    this.$el.html(html);

    if(this.selectedItem) {
      this.select(this.selectedItem);
    }
  },

  events: {
    "click #logout": "logout"
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