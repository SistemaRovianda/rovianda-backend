import { routeInterface } from "../Models/Route.Interface";
import { ProcessController } from '../Controllers/Process.Controller';
export const processRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/process",
        method:"post",
        controller:ProcessController,
        target:"createProcess"
    }
];