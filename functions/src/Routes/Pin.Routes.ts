import { routeInterface } from "../Models/Route.Interface";
import { PinController } from '../Controllers/Pin.Controller';
export const pinRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/pinss",
        method:"get",
        controller:PinController,
        target:"getAllPins"
    }
];