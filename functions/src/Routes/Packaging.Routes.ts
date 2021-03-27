import { routeInterface } from "../Models/Route.Interface";
import { PackagingController } from '../Controllers/Packaging.Controller';
export const packagingRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/packaging",
        method:"post",
        controller:PackagingController,
        target:"savePackaging"
    },{
        url:"/rovianda/packaging/:orderSellerId",
        method:"put",
        controller:PackagingController,
        target:"closeOrderSeller"   
    }
    ,{
        url:"/rovianda/pack",
        method:"get",
        controller:PackagingController,
        target:"getProducts" 
    },{
        url:"/rovianda/packaging/users/:packagingId",
        method:"post",
        controller:PackagingController,
        target:"saveUsersPackaging" 
    },{
        url:"/rovianda/packaging/users/:packagingId",
        method:"get",
        controller:PackagingController,
        target:"getPackagingColaboratedById"
    },{
        url:"/rovianda/packaging/assigned",
        method:"post",
        controller:PackagingController,
        target:"savePackagingAssigned"
    },{
        url: "/rovianda/packaging/assigned/:packagingId",
        method: "get",
        controller: PackagingController,
        target: "getPackagingAssignedBoxes"
    },{
        url: "/rovianda/sale/products",
        method: "get",
        controller: PackagingController,
        target: "getPackaging"
    },
    {
        url: "/rovianda/packaging-lots/inventory/product-order/:orderId", // servicio para obtener los productos por presentation y por lote en empaques /// productId
        method: "get",
        controller: PackagingController,
        target: "getPackagingInventoryLotsProduct"
    },
    {
        url: "/rovianda/packaging-lots/inventory/product/outputs",
        method: "post",
        controller: PackagingController,
        target: "savePackagingInventoryLotsProductOutput"
    },
    {
        url:"/rovianda/packaging/outputsProduct",
        method:"post",
        controller:PackagingController,
        target:"saveSubOrderMetaData" 
    },
    {
        url:"/rovianda/packaging/sellers/:urgent",
        method:"get",
        controller:PackagingController,
        target:"getOrderSellerByUrgent" 
    },
    {
        url:"/rovianda/packaging/lot",
        method:"get",
        controller:PackagingController,
        target:"getPackagingLotProduct" 
    },
    
    {
        url: "/rovianda/packaging/reprocessing",
        method:"post",
        controller: PackagingController,
        target: "createPackagingReprocesing"
    },
    {
        url: "/rovianda/packaging/reprocessing-report/:reprocesingId",
        method:"get",
        controller: PackagingController,
        target: "getPackagingReprocesingReport"
    }
    ,
    {
        url: "/rovianda/packaging/devolution",
        method: "post",
        controller: PackagingController,
        target: "createDevolution"
    },
    {
        url: "/rovianda/packaging/inventory-warehouse/:type",
        method: "get",
        controller: PackagingController,
        target: "getReportInventory"
    },
    {
        url: "/rovianda/packaging/inventory-plant",
        method: "get",
        controller: PackagingController,
        target: "getInventoryPlant"
    },
    {
        url: "/rovianda/packaging-inventory/plant",
        method: "put",
        controller: PackagingController,
        target: "UpdateInventoryPlant"
    }
    ,
    {
        url: "/rovianda/packaging/devolution-report/:devolutionId",
        method: "get",
        controller:PackagingController,
        target: "getDevolutionReport"
    },
    {
        url: "/rovianda/packaging-warehouse/:warehouseId",
        method: "get",
        controller: PackagingController,
        target: "getEntrancesToSellerInventoryByWarehouse"
    },
    {
        url: "/rovianda/plant-delivery",
        method: "get",
        controller: PackagingController,
        target: "getOutputsByPlant"
    },
    {
        url: "/rovianda/products-rovianda/inventory-lots/:presentationId",
        method: "get",
        controller: PackagingController,
        target: "getLotsStockInventory"
    }
];