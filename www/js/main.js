window.Router = Backbone.Router.extend({
  routes: {
    "": "underConstruction"
  },
  
  initialize: function () {
    this.headerView = new HeaderView();
    this.footerView = new FooterView();
    this.underConstructionView = new UnderConstructionView();

    this.headerView.render();
    this.footerView.render();
    
    $('body').click(function () {
      $('.dropdown').removeClass("open");
    });
  },

  underConstruction: function () {
    this.underConstructionView.render();
  }
});

utils.loadViews(["HeaderView", "FooterView", "UnderConstructionView"], function () {
  app = new Router();
  
  Backbone.history.start();
});