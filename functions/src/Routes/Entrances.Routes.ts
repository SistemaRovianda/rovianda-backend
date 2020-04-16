import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';

export const entrancesRoutes:Array<routeInterface>=[

    {
        url:"/entry/meat",
        method:"post",
        controller:EntrancesMeatController,
        target:"createEntrancesMeat"
    },{
        url:"/packing/entrance",
        method:"post",
        controller:EntrancesPackingController,
        target:"createWarehousePacking"
    },{
        url:"/packing/close",
        method:"post",
        controller:EntrancesPackingController,
        target:"closeWarehousePacking"
    },{
        url:"/packing/exit",
        method:"post",
        controller:EntrancesPackingController,
        target:"createOutputsPacking"
    }
];