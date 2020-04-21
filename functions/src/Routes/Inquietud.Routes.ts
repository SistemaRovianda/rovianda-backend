import { routeInterface } from "../Models/Route.Interface";
import { InquietudController } from '../Controllers/Inquietud.Controller';
export const inquietudRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/inquietud/entrance",
        method:"post",
        controller:InquietudController,
        target:"createCooling"
    },
    {
        url:"/rovianda/inquietud/close",
        method:"post",
        controller:InquietudController,
        target:"closedCooling"
    },
    {
        url:"/rovianda/inquietud/exit",
        method:"post",
        controller:InquietudController,
        target:"createOutputsCooling"
    }
];