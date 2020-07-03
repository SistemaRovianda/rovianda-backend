
import { routeInterface } from "../Models/Route.Interface";
import { OvenController } from '../Controllers/Oven.Controller';
export const ovenRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/oven/products",
        method:"get",
        controller:OvenController,
        target:"getOvenProducts"
    },{
        url: "/rovianda/oven/product/:productId",
        method: "patch",
        controller: OvenController,
        target: "updateOvenProduct"
    },
    {
        url: "/rovianda/oven/product/:productId",
        method: "get",
        controller: OvenController,
        target: "getOvenProductsByProductId"
    },
    {
        url: "/rovianda/oven/product",
        method: "post",
        controller: OvenController,
        target: "saveOvenProduct"
    },
    {
        url: "/rovianda/oven/users/:processId",
        method: "post",
        controller: OvenController,
        target: "saveOvenUser"
     },
     {
        url: "/rovianda/oven/product/:productId",
        method: "post",
        controller: OvenController,
        target: "createRevisionOvenProduct"
     },
     {   
        url: "/rovianda/oven/users/:productId",
        method: "get",
        controller: OvenController,
        target: "getOvenProductUser"
     },
     {
         url: "/rovianda/packaging/products/oven",
         method: "get",
         controller: OvenController,
         target: "getProductsByOvenClosed"
     }
];