import { routeInterface } from "../Models/Route.Interface";
import { FridgesController } from '../Controllers/Fridges.Controller';
export const fridgesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/fridge",//DONE
        method:"post",
        controller:FridgesController,
        target:"createFridges"
    },
    {
        url:"/rovianda/fridges",//DONE
        method:"get",
        controller:FridgesController,
        target:"getAllFridges"
    },
    {
        url:"/rovianda/fridge/:fridgeId",//DONE
        method: "delete",
        controller: FridgesController,
        target: "deleteFridge"   
    }
];