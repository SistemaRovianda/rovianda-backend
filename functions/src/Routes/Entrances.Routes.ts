import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';
import { EntranceDriefController } from "../Controllers/Entrances.Drief.Controller";

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
        url:"/rovianda/drief/exit",
        method:"post",
        controller:EntranceDriefController,
        target:"saveOutputsDrief"
    },
    {
        url:"/rovianda/drief/status/:warehouseDriefId",
        method:"patch",
        controller: EntranceDriefController,
        target:"updateWarehousePacking"
    },
    {
        url:"/rovianda/meat/status",
        method:"patch",
        controller:EntrancesMeatController,
        target:"updateStatusWarehouse"
    },
    {
        url:"/rovianda/meat/exit",
        method:"post",
        controller:EntrancesMeatController,
        target:"createOutputsCooling"
    },
    {
        url:"/rovianda/meat/:fridgeId",
        method:"get",
        controller:EntrancesMeatController,
        target:"getCoollingByFridge"
    },
    {
         url:"/rovianda/ingredients/lots",
         method:"get",
         controller:EntranceDriefController,
         target:"getOutputsDriefIngredients"
     },
     {
        url:"/rovianda/meat/raw/:lotId",
        method:"get",
        controller:EntrancesMeatController,
        target:"getCollingByLotInterno"
    },
    {
        url:"/rovianda/meat/lots/output",
        method:"get",
        controller:EntrancesMeatController,
        target:"getOutputsCoolingByStatus"
    }
];