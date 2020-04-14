import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';

export const entrancesRoutes:Array<routeInterface>=[

    {
        url:"/entry/meat",
        method:"post",
        controller:EntrancesMeatController,
        target:"createEntrancesMeat"
    },
];