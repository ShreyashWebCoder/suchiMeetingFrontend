
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",
  "sap/ui/core/Fragment",
  "sap/ui/Device"
], (Controller, JSONModel, History, Fragment, Device) => {
  "use strict";

  return Controller.extend("materialreq.controller.App", {
      onInit() {
        // Set device model
        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");
        
        // Get router
        this.oRouter = this.getOwnerComponent().getRouter();
        
        // Initialize with dashboard view
        this.oRouter.navTo("dashboard");
      },

      /**
       * Toggle side navigation visibility on small screens
       */
      onSideNavButtonPress: function() {
        var oToolPage = this.byId("toolPage");
        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
    },
    
    /**
     * Handle navigation item selection
     * @param {sap.ui.base.Event} oEvent Event object
     */
    onNavItemSelect: function(oEvent) {
        sessionStorage.removeItem('selectedRow');
        var oItem = oEvent.getParameter("item");
        var sKey = oItem.getKey();

        switch (sKey) {
            case "dashboard":
                this.oRouter.navTo("dashboard");
                break;
            case "createRequest":
                this.oRouter.navTo("createRequest");
                break;
            case "approvalView":
                // Navigate to approval view with sample requisition ID
                this.oRouter.navTo("approvalView", { requisitionId: "TR-2025-003" });
                break;
            case "storeView":
                // Navigate to store view with sample requisition ID
                this.oRouter.navTo("storeView", { requisitionId: "TR-2025-002" });
                break;
            default:
                this.oRouter.navTo("dashboard");
        }
    }
      
  });
});
