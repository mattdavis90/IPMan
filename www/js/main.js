window.views = [{
  reference  : "headerView",
  name       : "HeaderView",
  autoLoad   : true,
  accessLevel: 0
}, {
  reference  : "footerView",
  name       : "FooterView",
  autoLoad   : true,
  accessLevel: 0
}, {
  reference  : "homeView",
  name       : "HomeView",
  route      : "",
  showInMenu : true,
  menuText   : "Home",
  menuClass  : "home-menu",
  menuIcon   : "icon-home",
  accessLevel: 0
}, {
  reference  : "leasesView",
  name       : "LeasesView",
  route      : "leases",
  showInMenu : true,
  menuText   : "Leases",
  menuClass  : "leases-menu",
  menuIcon   : "icon-list",
  accessLevel: 1
}, {
  reference  : "usersView",
  name       : "UsersView",
  route      : "users",
  showInMenu : true,
  menuText   : "Users",
  menuClass  : "users-menu",
  menuIcon   : "icon-user",
  accessLevel: 2
}];

window.session = new Session();

utils.loadViews(views, function () {
  utils.refreshSession(function() {
    window.router = utils.createRouter(views);

    Backbone.history.start();

    utils.hideLoading();
  });
});
