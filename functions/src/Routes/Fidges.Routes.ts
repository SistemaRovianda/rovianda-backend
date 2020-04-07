import { routeInterface } from "../Models/Route.Interface";
import { FidgesController } from '../Controllers/Fidges.Controller';
export const fidgesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/Fidges",
        method:"post",
        controller:FidgesController,
        target:"createFidges"
    }
];