
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, History, MessageBox, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("materialrequisition.controller.SubContractorHOD", {

        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("subContractorHOD").attachPatternMatched(this._onObjectMatched, this);
            
            // Initialize the model
            this._initializeModel();
        },

        _initializeModel: function () {
            var oModel = new JSONModel({
                requestData: {
                    requestId: "MR-2025-001",
                    status: "Pending HOD Approval",
                    statusState: "Warning",
                    submittedDate: "2025-01-15",
                    submittedBy: "John Smith",
                    plant: "Plant 001 - Main Manufacturing",
                    projectName: "Project Alpha - Construction",
                    department: "Civil Engineering",
                    mainCode: "MAT-001 - Construction Materials",
                    subconName: "ABC Contractors Ltd.",
                    mrPrNo: "MR-2025-001",
                    requestorName: "John Smith",
                    requestorEmpNo: "EMP-12345",
                    date: "2025-01-15",
                    items: [
                        {
                            srNo: 1,
                            wbsElement: "WBS-001 - Foundation Work",
                            partNo: "CEMENT-001",
                            itemDescription: "Portland Cement 50kg bags",
                            quantity: 100,
                            uom: "Bags"
                        },
                        {
                            srNo: 2,
                            wbsElement: "WBS-002 - Structural Work",
                            partNo: "STEEL-001",
                            itemDescription: "Steel Rebar 12mm diameter",
                            quantity: 500,
                            uom: "Meters"
                        },
                        {
                            srNo: 3,
                            wbsElement: "WBS-001 - Foundation Work",
                            partNo: "SAND-001",
                            itemDescription: "Construction Sand Grade A",
                            quantity: 10,
                            uom: "Cubic Meters"
                        }
                    ],
                    approvals: []
                },
                hodAction: {
                    remarks: ""
                }
            });
            
            this.getView().setModel(oModel);
        },

        _onObjectMatched: function (oEvent) {
            var sRequestId = oEvent.getParameter("arguments").requestId;
            this._loadRequestData(sRequestId);
        },

        _loadRequestData: function (sRequestId) {
            // In a real application, this would load data from backend
            console.log("Loading request data for ID:", sRequestId);
            
            // Simulate loading data
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            oData.requestData.requestId = sRequestId;
            oModel.setData(oData);
        },

        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.oRouter.navTo("dashboard", {}, true);
            }
        },

        onRefresh: function () {
            var oModel = this.getView().getModel();
            var sRequestId = oModel.getProperty("/requestData/requestId");
            this._loadRequestData(sRequestId);
            MessageToast.show("Data refreshed");
        },

        _validateRemarks: function () {
            var oModel = this.getView().getModel();
            var sRemarks = oModel.getProperty("/hodAction/remarks");
            
            if (!sRemarks || sRemarks.trim().length === 0) {
                MessageBox.warning("Please provide remarks for your action.");
                return false;
            }
            
            if (sRemarks.trim().length < 10) {
                MessageBox.warning("Remarks should be at least 10 characters long.");
                return false;
            }
            
            return true;
        },

        onApprove: function () {
            if (!this._validateRemarks()) {
                return;
            }

            var that = this;
            MessageBox.confirm(
                "Are you sure you want to approve this material requisition?", {
                    title: "Confirm Approval",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that._performAction("APPROVED", "Request has been approved successfully.");
                        }
                    }
                }
            );
        },

        onReject: function () {
            if (!this._validateRemarks()) {
                return;
            }

            var that = this;
            MessageBox.confirm(
                "Are you sure you want to reject this material requisition?", {
                    title: "Confirm Rejection",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that._performAction("REJECTED", "Request has been rejected.");
                        }
                    }
                }
            );
        },

        onReturn: function () {
            if (!this._validateRemarks()) {
                return;
            }

            var that = this;
            MessageBox.confirm(
                "Are you sure you want to return this material requisition for revision?", {
                    title: "Confirm Return",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that._performAction("RETURNED", "Request has been returned for revision.");
                        }
                    }
                }
            );
        },

        _performAction: function (sAction, sMessage) {
            var oModel = this.getView().getModel();
            var sRemarks = oModel.getProperty("/hodAction/remarks");
            
            // Simulate API call
            this._showBusyDialog();
            
            setTimeout(() => {
                this._hideBusyDialog();
                
                // Update the model with the new status
                var oData = oModel.getData();
                oData.requestData.status = sAction === "APPROVED" ? "Approved by HOD" : 
                                         sAction === "REJECTED" ? "Rejected by HOD" : "Returned for Revision";
                oData.requestData.statusState = sAction === "APPROVED" ? "Success" : 
                                              sAction === "REJECTED" ? "Error" : "Warning";
                
                // Add to approval history
                var oApproval = {
                    approver: "HOD - Civil Engineering",
                    date: new Date().toISOString().split('T')[0],
                    status: sAction,
                    statusState: sAction === "APPROVED" ? "Success" : 
                               sAction === "REJECTED" ? "Error" : "Warning",
                    remarks: sRemarks
                };
                oData.requestData.approvals.push(oApproval);
                
                // Clear remarks
                oData.hodAction.remarks = "";
                
                oModel.setData(oData);
                
                MessageToast.show(sMessage);
                
                // Navigate back to dashboard after action
                setTimeout(() => {
                    this.onNavBack();
                }, 2000);
            }, 1500);
        },

        _showBusyDialog: function () {
            this._oBusyDialog = new sap.m.BusyDialog({
                text: "Processing your request..."
            });
            this._oBusyDialog.open();
        },

        _hideBusyDialog: function () {
            if (this._oBusyDialog) {
                this._oBusyDialog.close();
                this._oBusyDialog.destroy();
                this._oBusyDialog = null;
            }
        },

        onExit: function () {
            if (this._oBusyDialog) {
                this._oBusyDialog.destroy();
            }
        }
    });
});
