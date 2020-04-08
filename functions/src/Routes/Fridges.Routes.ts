import { routeInterface } from "../Models/Route.Interface";
import { FridgesController } from '../Controllers/Fridges.Controller';
export const fridgesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/fridge",
        method:"post",
        controller:FridgesController,
        target:"createFidges"
    },
    {
        url:"/rovianda/fridges",
        method:"get",
        controller:FridgesController,
        target:"getAllFridges"
    }
];