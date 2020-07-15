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
        url:"/rovianda/report/entry/meat/:meatId",
        method:"get",
        controller:ReportController,
        target:"reportEntranceMeat"
    },
    {
        url:"/rovianda/report/warehouse",
        method:"get",
        controller:ReportController,
        target:"reportWarehouseDrief"
    },
    {
        url:"/rovianda/report/formulation/:formulationId",
        method:"get",
        controller:ReportController,
        target:"reportFormulation"
    },
    {
        url:"/rovianda/report/entry/packing/:pakingId",
        method:"get",
        controller:ReportController,
        target:"reportEntrancePacking"
    },
    {
        url:"/rovianda/report/oven/:ovenId",
        method:"get",
        controller:ReportController,
        target:"reportOven"
    },
    {
        url:"/rovianda/report/entry/drief/:iniDate/:finDate/",
        method:"get",
        controller:ReportController,
        target:"reportEntryDriefByDates"
    }
];