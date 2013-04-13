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
  showInMenu : true,
  menuText   : "Home",
  menuLink   : "",
  menuClass  : "home-menu",
  menuIcon   : "icon-home",
  accessLevel: 0
}, {
  reference  : "leasesView",
  name       : "LeasesView",
  showInMenu : true,
  menuText   : "Leases",
  menuLink   : "leases",
  menuClass  : "leases-menu",
  menuIcon   : "icon-list",
  accessLevel: 1
}];

window.session = new Session();

utils.loadViews(views, function () {
  utils.refreshSession(function() {
    window.router = utils.createRouter(views);

    Backbone.history.start();

    utils.hideLoading();
  });
});
