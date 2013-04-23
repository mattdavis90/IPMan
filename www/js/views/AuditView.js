window.AuditView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
    this.audit = new Audit();
  },

  render: function () {
    var self = this;

    headerView.select(this.menuClass);

    this.audit.fetch({
      success: function(audit) {
        var html = _.template(self.template, {
          audit: audit.models
        });
        
        self.$el.html(html);

        $('#audit-table').dataTable({
          "aaSorting": [[ 0, "desc" ]]
        });
      }
    });
  },

  events: {
    "click .audit-clear": "clearAudit"
  },

  clearAudit: function(event) {
    var self = this;

    var log = new Log();
    log.set("_id", 0);

    yesNoView.show("Are you sure?", "Are you sure you want to clear the audit log? This action will be logged!", {
      yes: function() {
        log.destroy({
          success: function(model, response) {
            self.render();
          }
        });
      }
    });

    event.preventDefault();
  }
});