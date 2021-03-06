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
  reference  : "yesNoView",
  name       : "YesNoView",
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
  reference  : "editUserView",
  name       : "EditUserView",
  route      : "editUser",
  accessLevel: 1
}, {
  reference  : "searchView",
  name       : "SearchView",
  route      : "search",
  showInMenu : true,
  menuText   : "Search",
  menuClass  : "search-menu",
  menuIcon   : "icon-search",
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
}, {
  reference  : "subnetsView",
  name       : "SubnetsView",
  route      : "subnets",
  showInMenu : true,
  menuText   : "Subnets",
  menuClass  : "subnets-menu",
  menuIcon   : "icon-wrench",
  accessLevel: 2
}, {
  reference  : "auditView",
  name       : "AuditView",
  route      : "audit",
  showInMenu : true,
  menuText   : "Audit Log",
  menuClass  : "audit-menu",
  menuIcon   : "icon-check",
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
