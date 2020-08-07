import { routeInterface } from "../Models/Route.Interface";
import { ReportController } from '../Controllers/Report.Controller';

export const reportRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/report/entry/drief/:driefId",
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
        url:"/rovianda/report/document/formulation/:formulationId",
        method:"get",
        controller:ReportController,
        target:"reportDocumentFormulation"
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
        url: "/rovianda/report/formulation/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "reportFormularionByDate"
    },
    {
        url:"/rovianda/report/entry/drief/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"reportEntryDriefByDates"
    },
    {
        url:"/rovianda/report/entry/meat/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"reportEntryMeatByDates"
    },
    {
        url:"/rovianda/report/entry/packing/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"reportEntryPackingByDates"
    },
    {
        url:"/rovianda/report/oven/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"reportOvenByDates"
    },
    {
        url:"/rovianda/report/document/oven/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"documentReportOvenByDates"
    },
    {
        url:"/rovianda/report/process/:processId",
        method:"get",
        controller:ReportController,
        target:"reportProcess"
    },
    {
        url: "/rovianda/report/formulation/document/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "documentReportFormulationByDates"
    },
    {
        url: "/rovianda/report/entry/packing/document/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "documentReportPackingByDates"
    }
];