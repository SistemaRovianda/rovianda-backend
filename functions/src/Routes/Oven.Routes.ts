
import { routeInterface } from "../Models/Route.Interface";
import { OvenController } from '../Controllers/Oven.Controller';
export const ovenRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/oven/products",
        method:"get",
        controller:OvenController,
        target:"getOvenProducts"
    }
];