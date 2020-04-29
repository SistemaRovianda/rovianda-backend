import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';
import { EntranceDriefController } from "../Controllers/Entrance.Drief.Controller";

export const entrancesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/entry/meat",
        method:"post",
        controller:EntrancesMeatController,
        target:"createEntrancesMeat"
    },
    {
        url:"/rovianda/entry/packing",
        method:"post",
        controller: EntrancesPackingController,
        target:"createEntrancePacking"
    },
    {
        url:"/rovianda/entry/drief",
        method:"post",
        controller: EntranceDriefController,
        target:"saveEntrance"
        
    },
    {
        url:"/rovianda/packing/status",
        method:"patch",
        controller:EntrancesPackingController,
        target:"updateWarehousePacking"
    },
    {
        url:"/rovianda/packing/exit",
        method:"post",
        controller:EntrancesPackingController,
        target:"createOutputsPacking"
    },
    {
        url:"/rovianda/drief/status",
        method:"post",
        controller: EntranceDriefController,
        target:"updateWarehousePacking"
    }
];