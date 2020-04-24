import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';

export const entrancesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/entry/meat",
        method:"post",
        controller:EntrancesMeatController,
        target:"createEntrancesMeat"
    },{
        url:"/rovianda/packing/entrance",
        method:"post",
        controller:EntrancesPackingController,
        target:"createWarehousePacking"
    },{
        url:"/rovianda/packing/close",
        method:"post",
        controller:EntrancesPackingController,
        target:"closeWarehousePacking"
    },{
        url:"/rovianda/packing/exit",
        method:"post",
        controller:EntrancesPackingController,
        target:"createOutputsPacking"
    }
];