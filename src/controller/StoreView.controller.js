
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, MessageBox, JSONModel, History) {
    "use strict";

    return Controller.extend("materialreq.controller.StoreView", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("storeView").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRequisitionId = oEvent.getParameter("arguments").requisitionId;
            this._loadRequestData(sRequisitionId);
        },

        _loadRequestData: function (sRequisitionId) {
            // Mock data - in real scenario, this would come from backend
            var oData = {
                requisitionNumber: sRequisitionId,
                approvedDate: "22/02/2025",
                requestorName: "Robert Brown",
                subconName: "ABC Construction",
                priority: "High",
                priorityState: "Error",
                status: "Approved - Ready for Issue",
                statusState: "Success",
                
                issueDate: new Date(),
                issuedTo: "ABC Construction",
                vehicleNumber: "",
                driverName: "",
                issueNotes: "",
                
                packageType: "",
                numberOfPackages: 1,
                totalWeight: 0,
                packingNotes: "",
                
                packageTypes: [
                    { key: "BOX", text: "Box" },
                    { key: "PALLET", text: "Pallet" },
                    { key: "CRATE", text: "Crate" }
                ],
                
                items: [
                    {
                        srNo: 1,
                        partNo: "PN001",
                        itemDescription: "Steel Bars 12mm",
                        requiredQuantity: 100,
                        availableQuantity: 150,
                        pickedQuantity: 0,
                        uom: "EA",
                        storageLocation: "A-01-001",
                        pickingStatus: "Pending",
                        pickingStatusState: "Warning"
                    },
                    {
                        srNo: 2,
                        partNo: "PN002",
                        itemDescription: "Cement Bags",
                        requiredQuantity: 50,
                        availableQuantity: 75,
                        pickedQuantity: 0,
                        uom: "KG",
                        storageLocation: "B-02-005",
                        pickingStatus: "Pending",
                        pickingStatusState: "Warning"
                    },
                    {
                        srNo: 3,
                        partNo: "PN003",
                        itemDescription: "Welding Rods",
                        requiredQuantity: 25,
                        availableQuantity: 30,
                        pickedQuantity: 0,
                        uom: "EA",
                        storageLocation: "C-01-003",
                        pickingStatus: "Pending",
                        pickingStatusState: "Warning"
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

        onPickedQuantityChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var oModel = this.getView().getModel();
            var sPath = oBindingContext.getPath();
            
            var iPickedQty = parseInt(oSource.getValue()) || 0;
            var iRequiredQty = oBindingContext.getProperty("requiredQuantity");
            var iAvailableQty = oBindingContext.getProperty("availableQuantity");
            
            // Validation
            if (iPickedQty > iAvailableQty) {
                MessageToast.show("Picked quantity cannot exceed available quantity");
                oSource.setValue(iAvailableQty);
                iPickedQty = iAvailableQty;
            }
            
            // Update status
            var sStatus, sStatusState;
            if (iPickedQty === 0) {
                sStatus = "Pending";
                sStatusState = "Warning";
            } else if (iPickedQty < iRequiredQty) {
                sStatus = "Partial";
                sStatusState = "Warning";
            } else {
                sStatus = "Completed";
                sStatusState = "Success";
            }
            
            oModel.setProperty(sPath + "/pickingStatus", sStatus);
            oModel.setProperty(sPath + "/pickingStatusState", sStatusState);
        },

        onMarkAllPicked: function () {
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
            
            aItems.forEach(function (oItem) {
                oItem.pickedQuantity = Math.min(oItem.requiredQuantity, oItem.availableQuantity);
                oItem.pickingStatus = "Completed";
                oItem.pickingStatusState = "Success";
            });
            
            oModel.setProperty("/items", aItems);
            MessageToast.show("All items marked as picked");
        },

        onSaveProgress: function () {
            MessageToast.show("Progress saved successfully");
        },

        onCompleteIssue: function () {
            var that = this;
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
            
            // Validation
            var bAllPicked = aItems.every(function (oItem) {
                return oItem.pickedQuantity > 0;
            });
            
            if (!bAllPicked) {
                MessageBox.error("Please pick all items before completing the issue");
                return;
            }
            
            var sVehicleNumber = oModel.getProperty("/vehicleNumber");
            var sDriverName = oModel.getProperty("/driverName");
            
            if (!sVehicleNumber || !sDriverName) {
                MessageBox.error("Please fill vehicle number and driver name");
                return;
            }
            
            MessageBox.confirm("Complete material issue? This action cannot be undone.", {
                title: "Confirm Issue Completion",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Here you would normally call backend service
                        MessageToast.show("Material issue completed successfully");
                        that.onNavBack();
                    }
                }
            });
        }
    });
});
