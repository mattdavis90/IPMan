window.utils = {
  loadViews: function(views, callback) {
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
        }, 'html'));
      } else {
        console.log(view.name + " wasn't loaded. Did you include the js file?");
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

  checkAuth: function(requiredAccessLevel, callback) {
    var sessionAccessLevel = session.get("accessLevel") || 0;

    if(requiredAccessLevel > sessionAccessLevel) {
      router.navigate("/", true);
    } else {
      callback();
    }
  }
};