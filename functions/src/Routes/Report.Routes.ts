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
        url:"/rovianda/report/entry/meat/:entranceId",
        method:"get",
        controller:ReportController,
        target:"reportEntranceMeat"
    }
    ,
    {
        url:"/rovianda/report-excel/entry/meat/:entranceId",
        method:"get",
        controller:ReportController,
        target:"reportExcelEntranceMeat"
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
        url: "/rovianda/report/formulation/:dateInit/:dateEnd/:entranceId",// pdf de formulaciones
        method: "get",
        controller: ReportController,
        target: "reportFormulationByDate"
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
        url:"/rovianda/report/oven/:iniDate/:finDate/:entranceId",
        method:"get",
        controller:ReportController,
        target:"reportOvenByDates"
    },
     {
        url: "/rovianda/report/process/:processId",
        method: "get",
        controller: ReportController,
        target: "reportProcess"
    },
    {
        url: "/rovianda/report/process",
        method: "get",
        controller: ReportController,
        target: "reportProcessByEntranceId"
    },
    {
        url:"/rovianda/report/document/process",
        method:"get",
        controller:ReportController,
        target:"reportDocumentProcess"
    }, 
    {
        url: "/rovianda/report/document/formulation/:iniDate/:finDate/:entranceId",
        method: "get",
        controller: ReportController,
        target: "documentReportFormulationByDates"
    },
    // {
    //     url: "/rovianda/report/document/ended-product/:iniDate/:finDate/:entranceId",
    //     method: "get",
    //     controller: ReportController,
    //     target: "documentReportPackingByDates"
    // },
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
    },{
        url: "/rovianda/report/ended-product/:dateInit/:dateEnd/:entranceId",
        method: "get",
        controller: ReportController,
        target: "getReportEndedProduct"
    },{
        url: "/rovianda/report/document/ended-product/:dateInit/:dateEnd/:entranceId",
        method: "get",
        controller: ReportController,
        target: "getReportDocumentEndedProduct"  
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
        url:"/rovianda/report/document/oven/:iniDate/:finDate/:entranceId",
        method:"get",
        controller:ReportController,
        target:"documentReportOvenByDates"
    },
    {
        url:"/rovianda/report/packaging/:packaginId",
        method:"get",
        controller:ReportController,
        target:"reportPackagingById"
    },
    {
        url: "/rovianda/report/packaging-delivered/:orderSellerId",
        method: "get",
        controller: ReportController,
        target: "getReportPackagingDelivered"
    },
    {
        url: "/rovianda/report/sellers/delivered",
        method: "post",
        controller: ReportController,
        target: "getReportSellerDelivered"
    },
    {
        url: "/rovianda/sellers/orders-list",
        method: "get",
        controller: ReportController,
        target: "getListOfOrdersSeller"
    },
    {
        url: "/rovianda/report/packaging/:dateInit/:dateEnd/:entranceId",
        method: "get",
        controller: ReportController,
        target: "getReportByPackaging"
    },
    
    {
        url:"/rovianda/report/document/packaging/:dateInit/:dateEnd/:entranceId",
        method:"get",
        controller:ReportController,
        target:"reportDocumentPackagingById"
    },
    {
        url: "/rovianda/report/packaging-warehouse/:warehouseId",
        method: "get",
        controller: ReportController,
        target: "getEntrancesToSellerInventoryByWarehouse"
    },
    {
        url:"/rovianda/report/plant-delivery",
        method: "get",
        controller: ReportController,
        target: "getReportPlantDelivery"
    },
    {
        url:"/rovianda/report/visits",
        method:"post",
        controller:ReportController,
        target:"getReportVisits"
    },
    {
        url: "/rovianda/report/sold-period",
        method: "post",
        controller: ReportController,
        target: "getReportSoldPeriod"
    },
    {
        url: "/rovianda/report/customer-schedule",
        method:"post",
        controller: ReportController,
        target: "getCustomerScheduleReport"
    },
    {
        url: "/rovianda/daily-sale/presales/report",
        method:"post",
        controller: ReportController,
        target: "getDailyPreSaleReport"
    },
    {
        url: "/rovianda/daily-sale/details/sales/report",
        method:"post",
        controller: ReportController,
        target: "getDailySaleReport"
    },
    {
        url: "/rovianda/daily-sale/details/presales/report",
        method:"post",
        controller: ReportController,
        target: "getDailyPreSalesASellerReport"
    },
    {
        url: "/rovianda/effective-delivery/presales/report",
        method:"post",
        controller: ReportController,
        target: "getDailyEffectiveDeliverReport"
    },
    {
        url: "/rovianda/visits-aday/sellers/report",
        method: "post",
        controller: ReportController,
        target: "getVisitsADaySellersReport"
    }
];