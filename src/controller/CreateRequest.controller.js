
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, MessageBox, JSONModel, History) {
    "use strict";

    return Controller.extend("materialreq.controller.CreateRequest", {

        onInit: function () {
            this._initializeFormData();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("createRequest").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._initializeFormData();
        },

        _initializeFormData: function () {
            var oData = {
                currentDate: new Date().toLocaleDateString(),
                requestor: "Default User",
                requestorName: "Default User",
                requestorEmpNo: "DEFAULT_USER",
                requestDate: new Date(),
                plant: "",
                projectName: "",
                department: "",
                mainCode: "",
                subconName: "",
                mrPrNo: "",
                
                // Dropdown options
                plants: [
                    { key: "1000", text: "Plant 1000 - Main Manufacturing" },
                    { key: "2000", text: "Plant 2000 - Secondary Facility" }
                ],
                projects: [
                    { key: "PRJ001", text: "Project Alpha" },
                    { key: "PRJ002", text: "Project Beta" }
                ],
                departments: [
                    { key: "MECH", text: "Mechanical" },
                    { key: "ELEC", text: "Electrical" },
                    { key: "CIVIL", text: "Civil" }
                ],
                mainCodes: [
                    { key: "MC001", text: "Materials" },
                    { key: "MC002", text: "Equipment" }
                ],
                subcontractors: [
                    { key: "SC001", text: "ABC Construction" },
                    { key: "SC002", text: "XYZ Engineering" }
                ],
                wbsElements: [
                    { key: "WBS001", text: "WBS Element 1" },
                    { key: "WBS002", text: "WBS Element 2" }
                ],
                partNumbers: [
                    { key: "PN001", text: "Part Number 001" },
                    { key: "PN002", text: "Part Number 002" }
                ],
                uoms: [
                    { key: "EA", text: "Each" },
                    { key: "KG", text: "Kilogram" },
                    { key: "M", text: "Meter" }
                ],
                
                items: [
                    {
                        srNo: 1,
                        wbsElement: "",
                        partNo: "",
                        itemDescription: "",
                        quantity: 1,
                        uom: "EA"
                    },
                    {
                        srNo: 2,
                        wbsElement: "",
                        partNo: "",
                        itemDescription: "",
                        quantity: 1,
                        uom: "EA"
                    }
                ],
                
                attachments: []
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

        onAddItem: function () {
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
            var iNewSrNo = aItems.length + 1;
            
            aItems.push({
                srNo: iNewSrNo,
                wbsElement: "",
                partNo: "",
                itemDescription: "",
                quantity: 1,
                uom: "EA"
            });
            
            oModel.setProperty("/items", aItems);
            MessageToast.show("New item added");
        },

        onDeleteItem: function (oEvent) {
            var oList = oEvent.getSource();
            var aSelectedItems = oList.getSelectedItems();
            
            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select items to delete");
                return;
            }
            
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
            
            for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                var iIndex = oList.indexOfItem(aSelectedItems[i]);
                aItems.splice(iIndex, 1);
            }
            
            // Renumber items
            for (var j = 0; j < aItems.length; j++) {
                aItems[j].srNo = j + 1;
            }
            
            oModel.setProperty("/items", aItems);
            oList.removeSelections();
            MessageToast.show("Selected items deleted");
        },

        onDeleteSingleItem: function (oEvent) {
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
            var oBindingContext = oEvent.getSource().getBindingContext();
            var iIndex = oBindingContext.getPath().split("/")[2];
            
            aItems.splice(parseInt(iIndex), 1);
            
            // Renumber items
            for (var i = 0; i < aItems.length; i++) {
                aItems[i].srNo = i + 1;
            }
            
            oModel.setProperty("/items", aItems);
            MessageToast.show("Item deleted");
        },

        onIncreaseQuantity: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sPath = oBindingContext.getPath() + "/quantity";
            var oModel = this.getView().getModel();
            var iCurrentQuantity = oModel.getProperty(sPath);
            
            oModel.setProperty(sPath, iCurrentQuantity + 1);
        },

        onDecreaseQuantity: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            var sPath = oBindingContext.getPath() + "/quantity";
            var oModel = this.getView().getModel();
            var iCurrentQuantity = oModel.getProperty(sPath);
            
            if (iCurrentQuantity > 1) {
                oModel.setProperty(sPath, iCurrentQuantity - 1);
            }
        },

        onSearchItems: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("itemsTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var aFilters = [
                    new sap.ui.model.Filter("itemDescription", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("partNo", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var oFilter = new sap.ui.model.Filter(aFilters, false);
                oBinding.filter(oFilter);
            } else {
                oBinding.filter([]);
            }
        },

        onUploadFile: function () {
            MessageToast.show("File upload functionality to be implemented");
        },

        onSaveAsDraft: function () {
            var that = this;
            MessageBox.confirm("Save this requisition as draft?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        MessageToast.show("Requisition saved as draft");
                        that.onNavBack();
                    }
                }
            });
        },

        onSubmit: function () {
            var that = this;
            
            // Basic validation
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            
            if (!oData.plant || !oData.projectName || !oData.department || !oData.subconName) {
                MessageBox.error("Please fill all required fields");
                return;
            }
            
            if (oData.items.length === 0) {
                MessageBox.error("Please add at least one item");
                return;
            }
            
            MessageBox.confirm("Submit this requisition for approval?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        MessageToast.show("Requisition submitted successfully");
                        that.onNavBack();
                    }
                }
            });
        },

        onCancel: function () {
            var that = this;
            MessageBox.confirm("Discard changes and go back?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        that.onNavBack();
                    }
                }
            });
        }
    });
});
