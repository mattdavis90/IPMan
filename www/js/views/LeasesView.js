window.LeasesView = Backbone.View.extend({
  el: "#content",

  initialize: function() {
    this.ipAddresses = new IPAddresses();
    this.leases = new Leases();
    this.subnets = new Subnets();
    this.currentSubnet = undefined;
  },

  render: function() {
    var self = this;

    headerView.select(self.menuClass);
    
    self.subnets.fetch({
      success: function(subnets){
        self.ipAddresses.fetch({
          success: function(ipAddresses) {
            self.leases.fetch({
              success: function(leases) {
                subnets = subnets.models[0].get("subnets");
                if(self.currentSubnet == undefined) self.currentSubnet = subnets[0];
                
                var html = _.template(self.template, {
                  subnets      : subnets,
                  currentSubnet: self.currentSubnet,
                  ipAddresses  : ipAddresses.models,
                  leases       : leases.models
                });

                self.$el.html(html);
              }
            });
          }
        });
      }
    });
  },

  events: {
    "submit .lease-form"   : "newLease",
    "change #subnet-select": "updateIPs",
    "click .btn-release"   : "release"
  },

  newLease: function(event) {
    var self = this;
    
    utils.formToJSON(event.currentTarget, function(lease) {
      var newLease = new Lease();

      newLease.save(lease, {
        success: function(model, response, options) {
          if(response.error) {
            self.showError(response.error);
          } else {
            self.render();
          }
        }, 

        error: function(model, xhr, options) {
          self.showError("Could not contact server");
        }
      });

      event.preventDefault();
    });
  },

  updateIPs: function(event) {
    this.currentSubnet = event.currentTarget.value;
    this.render();
  },

  release: function(event) {
    var self = this;

    var id = event.currentTarget.value;
    var lease = this.leases.get(id);

    lease.destroy({
      success: function(model, response) {
        self.render();
      }
    });
  },
  
  showError: function(error) {
    $('.lease-error').html(error).show();
  }
});