import { routeInterface } from "../Models/Route.Interface";
import { ReportController } from '../Controllers/Report.Controller';

export const reportRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/report/enty/drief/:driefId",
        method:"get",
        controller:ReportController,
        target:"reportEntranceDrief"
    },
    {
        url:"/rovianda/report/enty/meat/:meatId",
        method:"get",
        controller:ReportController,
        target:"reportEntranceMeat"
    }
];