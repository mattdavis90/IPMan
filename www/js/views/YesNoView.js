window.YesNoView = Backbone.View.extend({
  el: "#popup",

  initialize: function () {
    this.callback = undefined;
  },

  render: function () {
    var html = _.template(this.template, {});
    this.$el.html(html);
  },

  events: {
    "click .btn-success": "yesClick",
    "click .btn-danger" : "noClick"
  },

  show: function(header, body, callback) {
    this.$el.find('.modal-header h3').html(header);
    this.$el.find('.modal-body p').html(body);

    this.callback = callback;

    this.$el.find('.modal').modal('show');
  },

  hide: function() {
    this.callback = undefined;

    this.$el.find('.modal').modal('hide');
  },

  yesClick: function(event) {
    if(this.callback && this.callback.yes) {
      this.callback.yes();
    }

    this.hide();

    event.preventDefault();
  },

  noClick: function(event) {
    if(this.callback && this.callback.no) {
      this.callback.no();
    }

    this.hide();

    event.preventDefault();
  }
});