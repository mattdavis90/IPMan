window.Router = Backbone.Router.extend({
  routes: {
    "": "home",
    "leases": "leases"
  },
  
  initialize: function () {
    headerView.render();
    footerView.render();
  },

  home: function () {
    homeView.render();
  },

  leases: function() {
    leasesView.render();
  }
});

window.views = [{
  reference  : "headerView",
  name       : "HeaderView",
  showInMenu : false,
  accessLevel: 0
}, {
  reference  : "footerView",
  name       : "FooterView",
  showInMenu : false,
  accessLevel: 0
}, {
  reference  : "homeView",
  name       : "HomeView",
  showInMenu : true,
  menuText   : "Home",
  menuLink   : "#",
  menuClass  : "home-menu",
  accessLevel: 0
}, {
  reference  : "leasesView",
  name       : "LeasesView",
  showInMenu : true,
  menuText   : "Leases",
  menuLink   : "#/leases",
  menuClass  : "leases-menu",
  accessLevel: 1
}];

window.session = new Session();

utils.loadViews(views, function () {
  utils.refreshSession(function() {
    window.router = new Router();

    Backbone.history.start();
  });
});