import { routeInterface } from "../Models/Route.Interface";
import { LotController } from '../Controllers/Lot.Controller';
import { RawController } from '../Controllers/Raw.Controller';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
export const lotRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/lots",
        method:"get",
        controller:LotController,
        target:"getAllLots"
    },{
        url:"/rovianda/lot/ingredients",
        method:"get",
        controller: LotController,
        target: "getOutputIngredients"
    },{
        url:"/rovianda/ingredients/lots",
        method:"post",
        controller: LotController,
        target: "getIngredientsLots"
    },{
        url: "/rovianda/quality/history/packaging/:lotId",
        method: "get",
        controller: LotController,
        target: "getPackingHistory"
    },{
        url: "/rovianda/quality/history/drief/:entranceId",
        method: "get",
        controller: LotController,
        target: "getDriefHistory"
    },{
        url: "/rovianda/raw/material",
        method: "get",
        controller: RawController,
        target: "getRaw"
    },
    {
        url: "/rovianda/quality/history/meat/:entranceId",
        method: "get",
        controller: EntrancesMeatController,
        target: "getHistoryMeatEntrance" 
    },
    {
        url: "/rovianda/quality/history/meat-cooling/:entranceId",
        method: "get",
        controller: EntrancesMeatController,
        target: "getHistoryMeatCooling" 
    },
    {
        url: "/rovianda/quality/history/meat-out-cooling/:entranceId",
        method: "get",
        controller: EntrancesMeatController,
        target: "getHistoryOutputCooling" 
    },
    {
        url: "/rovianda/quality/history/meat-formulations",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByOutputsFormulations" 
    },
    {
        url: "/rovianda/quality/history/meat-process",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByOutputsProcess" 
    },
    {
        url: "/rovianda/quality/history/meat-oven",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByOutputsOvenByProcessId" 
    },
    {
        url: "/rovianda/quality/history/meat-packaging",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByOutputsPackagingByOvenIds" 
    },
    {
        url: "/rovianda/quality/history/meat-devolutions",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByDevolutionsByOvenByOvenIds" 
    },
    {
        url: "/rovianda/quality/history/meat-reprocesings",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByReprocesingsByOvenByOvenIds" 
    },
    {
        url: "/rovianda/quality/history/meat-inspections",
        method: "post",
        controller: EntrancesMeatController,
        target: "getHistoryByInspectionByOvenByOvenIds" 
    },

    {
        url: "/rovianda/lote/formulation-enabled/:productRoviandaId",  // /rovianda/lote/meat/proces
        method: "get",
        controller: LotController,
        target:"getLotMeatProductRoviandaId"
    },
    {
        url: "/rovianda/product/catalog",
        method: "get",
        controller: LotController,
        target:"getAllLotsProduct"
    },
    {
        url: "/rovianda/product/lots/:productId",
        method: "get",
        controller: LotController,
        target:"getAllLotsByProduct"
    },
    {
        url: "/rovianda/product/lots/outputs/cooling",
        method: "get",
        controller: LotController,
        target: "getAllLotsCoolingAvailables"
    }
];