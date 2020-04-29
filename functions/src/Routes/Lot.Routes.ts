import { routeInterface } from "../Models/Route.Interface";
import { LotController } from '../Controllers/Lot.Controller';
export const lotRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/lots",
        method:"get",
        controller:LotController,
        target:"getAllLots"
    }
];