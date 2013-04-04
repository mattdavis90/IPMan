window.utils = {
  loadViews: function(views, callback) {
    var deferreds = [];

    $.each(views, function(index, view) {
      if (window[view]) {
        deferreds.push($.get('views/' + view + '.html', function(data) {
          window[view].prototype.template = data;
        }, 'html'));
      } else {
        console.log(view + " wasn't loaded");
      }
    });

    $.when.apply(null, deferreds).done(callback);
  }
};