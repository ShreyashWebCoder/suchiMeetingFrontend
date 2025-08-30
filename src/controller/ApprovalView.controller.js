
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, MessageBox, JSONModel, History) {
    "use strict";

    return Controller.extend("materialreq.controller.ApprovalView", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("approvalView").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRequisitionId = oEvent.getParameter("arguments").requisitionId;
            this._loadRequestData(sRequisitionId);
        },

        _loadRequestData: function (sRequisitionId) {
            // Mock data - in real scenario, this would come from backend
            var oData = {
                requisitionNumber: sRequisitionId,
                requestDate: "20/02/2025",
                requestorName: "Robert Brown",
                company: "Tech Solutions",
                status: "Pending Approval",
                statusState: "Warning",
                totalItems: 3,
                plant: "Plant 1000 - Main Manufacturing",
                projectName: "Project Alpha",
                department: "Mechanical",
                mainCode: "Materials",
                subconName: "ABC Construction",
                approvalComments: "",
                
                items: [
                    {
                        srNo: 1,
                        wbsElement: "WBS001",
                        partNo: "PN001",
                        itemDescription: "Steel Bars 12mm",
                        quantity: 100,
                        uom: "EA"
                    },
                    {
                        srNo: 2,
                        wbsElement: "WBS002",
                        partNo: "PN002",
                        itemDescription: "Cement Bags",
                        quantity: 50,
                        uom: "KG"
                    },
                    {
                        srNo: 3,
                        wbsElement: "WBS001",
                        partNo: "PN003",
                        itemDescription: "Welding Rods",
                        quantity: 25,
                        uom: "EA"
                    }
                ],
                
                previousComments: [
                    {
                        sender: "Robert Brown",
                        timestamp: "2 days ago",
                        comment: "Urgent requirement for ongoing project work.",
                        icon: "sap-icon://person-placeholder"
                    }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("dashboard", {}, true);
            }
        },

        onApprove: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var sComments = oModel.getProperty("/approvalComments");
            
            if (!sComments.trim()) {
                MessageBox.error("Please add approval comments before proceeding.");
                return;
            }
            
            MessageBox.confirm("Approve this material requisition?", {
                title: "Confirm Approval",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Here you would normally call backend service
                        MessageToast.show("Requisition approved successfully");
                        that.onNavBack();
                    }
                }
            });
        },

        onReject: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var sComments = oModel.getProperty("/approvalComments");
            
            if (!sComments.trim()) {
                MessageBox.error("Please add rejection reason before proceeding.");
                return;
            }
            
            MessageBox.confirm("Reject this material requisition?", {
                title: "Confirm Rejection",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Here you would normally call backend service
                        MessageToast.show("Requisition rejected");
                        that.onNavBack();
                    }
                }
            });
        },

        onReturn: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var sComments = oModel.getProperty("/approvalComments");
            
            if (!sComments.trim()) {
                MessageBox.error("Please add return reason before proceeding.");
                return;
            }
            
            MessageBox.confirm("Return this material requisition to requestor?", {
                title: "Confirm Return",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Here you would normally call backend service
                        MessageToast.show("Requisition returned to requestor");
                        that.onNavBack();
                    }
                }
            });
        }
    });
});
