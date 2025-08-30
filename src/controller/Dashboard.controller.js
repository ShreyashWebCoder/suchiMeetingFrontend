
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, JSONModel, History) {
    "use strict";

    return Controller.extend("materialreq.controller.Dashboard", {

        onInit: function () {
            this._initializeData();
            this._setViewModel();
        },

        _initializeData: function () {
            // Initialize dashboard data
            var oData = {
                draftCount: 0,
                pendingCount: 1,
                approvedCount: 1,
                completedCount: 0,
                returnCount: 1,
                rejectedCount: 0,
                requests: [
                    {
                        requisitionNumber: "TR-2025-003",
                        requestDate: "20/02/2025",
                        requestType: "Material Requisition",
                        employeeName: "Robert Brown",
                        employeeEmail: "robert.b@techsol.com",
                        company: "Tech Solutions",
                        vertical: "HR",
                        businessArea: "Recruitment",
                        costCentre: "CC003",
                        status: "Return",
                        statusState: "Warning",
                        lastUpdatedBy: "David Wilson",
                        lastUpdatedOn: "21/02/2025"
                    },
                    {
                        requisitionNumber: "TR-2025-002",
                        requestDate: "18/02/2025",
                        requestType: "Material Requisition",
                        employeeName: "Sarah Williams",
                        employeeEmail: "sarah.w@techsol.com",
                        company: "Tech Solutions",
                        vertical: "Sales",
                        businessArea: "Marketing",
                        costCentre: "CC002",
                        status: "Pending",
                        statusState: "Warning",
                        lastUpdatedBy: "Michael Chen",
                        lastUpdatedOn: "18/02/2025"
                    }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        _setViewModel: function () {
            var oViewModel = new JSONModel({
                busy: false,
                delay: 0
            });
            this.getView().setModel(oViewModel, "view");
        },

        onNewRequest: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("createRequest");
        },

        onRefresh: function () {
            MessageToast.show("Refreshing data...");
            this._initializeData();
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("requestsTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var aFilters = [
                    new sap.ui.model.Filter("requisitionNumber", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("employeeName", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var oFilter = new sap.ui.model.Filter(aFilters, false);
                oBinding.filter(oFilter);
            } else {
                oBinding.filter([]);
            }
        },

        onFilter: function () {
            MessageToast.show("Filter functionality to be implemented");
        },

        onRequestPress: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sRequisitionNumber = oBindingContext.getProperty("requisitionNumber");
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("requestDetail", {
                requisitionId: sRequisitionNumber
            });
        },

        onEditRequest: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sRequisitionNumber = oBindingContext.getProperty("requisitionNumber");
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("editRequest", {
                requisitionId: sRequisitionNumber
            });
        },

        onViewRequest: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sRequisitionNumber = oBindingContext.getProperty("requisitionNumber");
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("requestDetail", {
                requisitionId: sRequisitionNumber
            });
        }
    });
});
