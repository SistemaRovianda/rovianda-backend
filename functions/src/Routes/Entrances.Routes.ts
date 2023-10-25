import { routeInterface } from "../Models/Route.Interface";
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';
import { EntranceDriefController } from "../Controllers/Entrances.Drief.Controller";

export const entrancesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/entry/meat",//DONE
        method:"post",
        controller:EntrancesMeatController,
        target:"createEntrancesMeat"
    },
    {
        url:"/rovianda/entry/packing",//DONE
        method:"post",
        controller: EntrancesPackingController,
        target:"createEntrancePacking"
    },
    {
        url:"/rovianda/entry/drief",///DONE
        method:"post",
        controller: EntranceDriefController,
        target:"saveEntrance"
    },
    {
        url:"/rovianda/packing/status",//DONE 
        method:"patch",
        controller:EntrancesPackingController,
        target:"updateWarehousePacking"
    },
    {
        url:"/rovianda/packing/exit",//DONE
        method:"post",
        controller:EntrancesPackingController,
        target:"createOutputsPacking"
    },
    {
       url:"/rovianda/drief/exit",//DONE
        method:"post",
        controller:EntranceDriefController,
        target:"saveOutputsDrief"
    },
    {
        url:"/rovianda/drief/status/:warehouseDriefId",//DONE
        method:"patch",
        controller: EntranceDriefController,
        target:"updateWarehouseDrief"
    },
    {
        url:"/rovianda/drief",//DONE
        method:"get",
        controller: EntranceDriefController,
        target:"getAllWarehouseDrief"
    },
    {
        url:"/rovianda/meat/status",//DONE
        method:"patch",
        controller:EntrancesMeatController,
        target:"updateStatusWarehouse"
    },
    {
        url:"/rovianda/meat/exit",// DONE
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
         url:"/rovianda/ingredients/lots",// NOT USED
         method:"get",
         controller:EntranceDriefController,
         target:"getOutputsDrief"
     },
     {
        url:"/rovianda/meat/raw/:lotId",//DONE
        method:"get",
        controller:EntrancesMeatController,
        target:"getCollingByLotInterno"
    },
    {
        url:"/rovianda/meat/lots/output",//DONE
        method:"get",
        controller:EntrancesMeatController,
        target:"getOutputsCoolingByStatus"
    },
    {
        url:"/rovianda/lot/meat/output",//DONE
        method:"get",
        controller:EntrancesMeatController,
        target:"getLotMeat"
    },
    {
        url: "/rovianda/quality/entrances/:loteId",//DONE
        method:"get",
        controller: EntrancesMeatController,
        target: "getAllEntrancesOfmeat"
    },
    {
        url: "/rovianda/quality/drief/entrances/:loteId",//DONE
        method:"get",
        controller: EntrancesMeatController,
        target: "getAllEntrancesOfDrief"
    }
];