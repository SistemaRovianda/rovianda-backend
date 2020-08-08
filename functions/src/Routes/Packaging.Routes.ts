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
    }
];