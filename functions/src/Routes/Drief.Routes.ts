import { routeInterface } from "../Models/Route.Interface";
import { DriefController } from '../Controllers/Drief.Controller';
export const driefRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/dried/entrance",
        method:"post",
        controller:DriefController,
        target:"createWarehouseDrief"
    }
];