window.utils = {
  loadViews: function(views, callback) {
    var self = this;
    var count = views.length;
    var current = 0;
    var deferreds = [];

    $.each(views, function(index, view) {
      if (window[view.name]) {
        deferreds.push($.get('views/' + view.name + '.html', function(data) {
          // Load the template
          window[view.name].prototype.template = data;
          // Create a global reference to the view
          window[view.reference] = new window[view.name]();
          // Set the view's properties
          $.extend(window[view.reference], view);
          // Update the progress bar
          var progress = (++current) / count * 100;
          self.updateLoading(progress);
        }, 'html'));
      } else {
        console.error(view.name + " wasn't loaded. Did you include the js file?");
      }
    });

    $.when.apply(null, deferreds).done(callback);
  },

  refreshSession: function(callback) {
    session.clear();
    session.fetch({
      success: function(session) {
        if(callback) {
          callback(session);
        }
      }
    });
  },

  createRouter: function(views) {
    // Create a Backbone Router
    var Router = Backbone.Router.extend({
      initialize: function(views) {
        // Render all autoload views
        $.each(views, function(index, view) {
          if(view.autoLoad) {
            utils.checkAuth(view.accessLevel, function() {
              window[view.reference].render();
            });
          }
        });
      }
    });

    var router = new Router(views);

    // Create routes for views
    $.each(views, function(index, view) {
      if(view.route !== undefined) {
        router.route(view.route, "", function() {
          utils.checkAuth(view.accessLevel, function() {
            window[view.reference].render();
          });
        });
      }
    });

    return router;
  },

  checkAuth: function(requiredAccessLevel, callback) {
    var sessionAccessLevel = session.get("accessLevel") || 0;

    if(requiredAccessLevel > sessionAccessLevel) {
      router.navigate("/", true);
    } else {
      callback();
    }
  },

  formToJSON: function(form, callback) {
    var obj = {};
    
    $(form).find("[name]").each(function(i, el) {
      obj[$(el).attr("name")] = $(el).val();
    });

    callback(obj);
  },

  updateLoading: function(progress) {
    $('#loading .bar').width(progress + "%");
  },

  hideLoading: function() {
    $('#loading').hide();
  }
};
