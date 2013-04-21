window.SubnetsView = Backbone.View.extend({
  el: "#content",

  initialize: function () {
    this.subnets = new Subnets();
    this.ipAddresses = new IPAddresses();
  },

  render: function () {
    var self = this;

    headerView.select(this.menuClass);

    this.subnets.fetch({
      success: function(subnets) {
        self.ipAddresses.fetch({
          success: function(ipAddresses) {
            subnets = subnets.models[0].get("subnets");

            var html = _.template(self.template, {
              subnets: subnets,
              ipAddresses: ipAddresses.models
            });

            self.$el.html(html);
          }
        });
      }
    });
  },

  events: {
    "submit .add-subnet-form": "createSubnet",
    "submit .rem-subnet-form": "removeSubnet",
    "click .btn-remove"      : "removeIP"
  },

  createSubnet: function(event) {
    var self = this;

    utils.formToJSON(event.currentTarget, function(subnet) {
      if(subnet.name && subnet.baseIP && subnet.ipRangeStart && subnet.ipRangeEnd) {
        var parts = subnet.baseIP.split(".");

        if(!self.isNumber(subnet.ipRangeStart) || !self.isNumber(subnet.ipRangeEnd)) {
          self.showError("Please specifiy integers for the IP range");
        } else if(subnet.ipRangeStart < 0 || subnet.ipRangeStart > 255 || subnet.ipRangeEnd < 0 || subnet.ipRangeEnd > 255) {
          self.showError("The IP range must be values between 0-255");
        } else if(subnet.ipRangeStart >= subnet.ipRangeEnd) {
          self.showError("The IP range start must be before the end");
        } else if(parts.length != 3) {
          self.showError("The base IP should consist of 3 parts. e.g. 192.168.0");
        } else if(!self.isNumber(parts[0]) || !self.isNumber(parts[1]) || !self.isNumber(parts[2])) {
          self.showError("The base IP should be numerical. e.g. 192.168.0");
        } else if(parts[0] < 0 || parts[0] > 255 || parts[1] < 0 || parts[1] > 255 || parts[2] < 0 || parts[2] > 255) {
          self.showError("The base IP should be made of integers between 0-255. e.g. 192.168.0");
        } else {
          var noIPs = subnet.ipRangeEnd - subnet.ipRangeStart + 1;

          yesNoView.show("Are you sure?", "Are you sure you want to create " + noIPs + " IP Addresses?", {
            yes: function() {
              var ips = [];

              for(i = subnet.ipRangeStart; i <= subnet.ipRangeEnd; i++) {
                var ipAddress = {
                  subnet: subnet.name,
                  ipAddress: subnet.baseIP + "." + i,
                  reserved: false
                }

                ips.push(ipAddress);
              }

              var ipAddresses = new IPAddresses(ips);
              ipAddresses.saveAll(function() {
                self.render();
              });
            }
          });
        }
      } else {
        self.showError("Please specify all details");
      }
    });

    event.preventDefault();
  },

  removeSubnet: function(event) {
    var self = this;

    utils.formToJSON(event.currentTarget, function(subnet) {
      if(subnet.name) {
        var subnetModel = new Subnet({subnet: subnet.name});

        yesNoView.show("Are you sure?", "Are you sure you want to remove this subnet (" + subnet.name + ")?", {
          yes: function() {
            subnetModel.destroy({
              success: function(model, response) {
                self.render();
              }
            });
          }
        });
      }
    });

    event.preventDefault();
  },

  removeIP: function(event) {
    var self = this;

    var id = event.currentTarget.value;
    var ipAddress = this.ipAddresses.get(id);

    yesNoView.show("Are you sure?", "Are you sure you want to remove this IP (" + ipAddress.get("ipAddress") + ")?", {
      yes: function() {
        ipAddress.destroy({
          success: function(model, response) {
            self.render();
          }
        });
      }
    });
  },

  isNumber: function(num) {
    var retVal = false;

    if(parseInt(num) == num) {
      retVal = true;
    }

    return retVal;
  },
  
  showError: function(error) {
    $('.subnet-error').html(error).show();
  },
  
  hideError: function(error) {
    $('.subnet-error').hide();
  }
});