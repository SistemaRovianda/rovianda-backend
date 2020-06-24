import { routeInterface } from "../Models/Route.Interface";
import { LotController } from '../Controllers/Lot.Controller';
import { RawController } from '../Controllers/Raw.Controller';
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
        url: "/rovianda/quality/history/drief/:lotId",
        method: "get",
        controller: LotController,
        target: "getDriefHistory"
    },{
        url: "/rovianda/raw/material",
        method: "get",
        controller: RawController,
        target: "getRaw"
    }
];