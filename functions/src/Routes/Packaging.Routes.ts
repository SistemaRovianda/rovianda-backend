import { routeInterface } from "../Models/Route.Interface";
import { PackagingController } from '../Controllers/Packaging.Controller';
export const packagingRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/packaging",
        method:"post",
        controller:PackagingController,
        target:"savePackaging"
    },{
        url:"/rovianda/pack",
        method:"get",
        controller:PackagingController,
        target:"getProducts" 
    },{
        url:"/rovianda/packaging/reprocessing",
        method:"post",
        controller:PackagingController,
        target:"saveReprocessing" 
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
    },{
        url:"/rovianda/packaging/reprocessing/:area",
        method:"get",
        controller:PackagingController,
        target:"getReprocessingByArea" 
    },
    {
        url: "/rovianda/packaging-lots/inventory/product/:productId", // servicio para obtener los productos por presentation y por lote en empaques
        method: "get",
        controller: PackagingController,
        target: "getPackagingInventoryLotsProduct"
    },
    {
        url: "/rovianda/packaging-lots/inventory/product/outputs/:userPackingId",
        method: "post",
        controller: PackagingController,
        target: "savePackagingInventoryLotsProductOutput"
    },
    {
        url:"/rovianda/packaging/reprocessing/lot",
        method:"patch",
        controller:PackagingController,
        target:"updateReprocessing" 
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
    }
];