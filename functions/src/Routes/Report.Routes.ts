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
        url: "/rovianda/report/drying/:dryingId",
        method: "get",
        controller: ReportController,
        target: "reportDryinById"
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
        url:"/rovianda/report/document/warehouse",
        method:"get",
        controller:ReportController,
        target:"reportDocumentWarehouseDrief"
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
        url:"/rovianda/report/document/entry/meat/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"reportDocumentEntryMeatByDates"
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
        url:"/rovianda/report/process/:processId",
        method:"get",
        controller:ReportController,
        target:"reportProcess"
    },
    {
        url:"/rovianda/report/document/process/:processId",
        method:"get",
        controller:ReportController,
        target:"reportDocumentProcess"
    },
    {
        url: "/rovianda/report/document/formulation/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "documentReportFormulationByDates"
    },
    {
        url: "/rovianda/report/document/entry/packing/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "documentReportPackingByDates"
    },
    {
        url: "/rovianda/report/document/entry/drief/:iniDate/:finDate",
        method: "get",
        controller: ReportController,
        target: "documentReportEntryDriefsByDates"
    },
    {
        url: "/rovianda/report/document/oven/:ovenId",
        method: "get",
        controller: ReportController,
        target: "documentReportOvenById"
    },
    {
        url: "/rovianda/report/document/entry/packing/:pakingId",
        method: "get",
        controller: ReportController,
        target: "documentReportEntrancePackingById"
    },
    {
        url: "/rovianda/report/document/entry/meat/:meatId",
        method: "get",
        controller: ReportController,
        target: "documentReportEntryMeatById"
    },
    {
        url: "/rovianda/report/document/entry/drief/:driefId",
        method: "get",
        controller: ReportController,
        target: "documentReportEntryDriefById"
    },
    {
        url:"/rovianda/report/document/oven/:iniDate/:finDate",
        method:"get",
        controller:ReportController,
        target:"documentReportOvenByDates"
    },
    {
        url:"/rovianda/report/packagin/:packaginId",
        method:"get",
        controller:ReportController,
        target:"reportPackagingById"
    },
    {
        url:"/rovianda/report/document/packagin/:packaginId",
        method:"get",
        controller:ReportController,
        target:"reportDocumentPackagingById"
    }
];