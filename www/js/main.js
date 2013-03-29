window.Router = Backbone.Router.extend({
    routes: {
        "": "underConstruction"
    },
    initialize: function () {
        this.headerView = new HeaderView();

        $('.header').html(this.headerView.render().el);
        
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    underConstruction: function () {
        if (!this.underConstructionView) {
            this.underConstructionView = new UnderConstructionView();
            this.underConstructionView.render();
        } else {
            this.underConstructionView.delegateEvents();
        }

        $("#content").html(this.underConstructionView.el);
    }
});

templateLoader.load(["HeaderView", "UnderConstructionView"], function () {
    app = new Router();
    
    Backbone.history.start();
});