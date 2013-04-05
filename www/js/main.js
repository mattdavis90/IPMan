window.Router = Backbone.Router.extend({
  routes: {
    "": "underConstruction",
    "myLeases": "myLeases"
  },
  
  initialize: function () {
    this.headerView = new HeaderView();
    this.footerView = new FooterView();
    this.underConstructionView = new UnderConstructionView();
    this.myLeasesView = new MyLeasesView();

    this.headerView.render();
    this.footerView.render();
    
    $('body').click(function () {
      $('.dropdown').removeClass("open");
    });
  },

  underConstruction: function () {
    this.underConstructionView.render();
    this.headerView.select('home-menu');
  },

  myLeases: function() {
    this.myLeasesView.render();
    this.headerView.select('myleases-menu');
  }
});

utils.loadViews(["HeaderView", "FooterView", "UnderConstructionView", "MyLeasesView"], function () {
  app = new Router();
  
  Backbone.history.start();
});