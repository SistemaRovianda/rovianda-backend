import { routeInterface } from "../Models/Route.Interface";
import { UserController } from '../Controllers/User.Controller';
import {QualityController} from "../Controllers/Quality.Controller";
import { QualityService } from "../Services/Quality.Service";
export const qualityRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/quality/user",
        method:"post",
        controller:UserController,
        target:"createUserF"
    },
    {
        url:"/rovianda/user/:uuid",
        method:"get",
        controller:UserController,
        target:"getUserById"
    },
    {
        url:"/rovianda/user",
        method:"get",
        controller:UserController,
        target:"getAllUsers"
    },
    {
        url:"/rovianda/token",
        method:"get",
        controller:UserController,
        target:"createToken"
    },
    {
        url:"/rovianda/user/rol/:rol",
        method:"get",
        controller:UserController,
        target:"getUserByRol"
    },
    {
        url: "/rovianda/user-status",
        method: "put",
        controller: UserController,
        target: "updateUserStatus"
    },
    /// new Version
    {
        url: "/rovianda/history-inspection/:type",
        method:"get",
        controller: QualityController,
        target: "searchLotReceptionsProducts"
    },
    {
        url: "/rovianda/history-received/:type/:productName",
        method: "get",
        controller: QualityController,
        target: "searchReceptionsOfProduct"
    },
    {
        url: "/rovianda/history/outputs-warehouse/:entranceId",
        method: "get",
        controller: QualityController,
        target: "getHistoryOutputsWarehouseByEntranceId"
    },
    {
        url: "/rovianda/history/outputs-warehouse/formulations/ingredients/:formulationId",
        method: "get",
        controller: QualityController,
        target: "getHistoryOutputsWarehouseFormulationPagination"
    },
    {
        url: "/rovianda/history/process-outputs",
        method: "get",
        controller: QualityController,
        target: "getHistoryOutputsWarehouseProcess"
    },
    {
        url: "/rovianda/history/oven-outputs",
        method: "get",
        controller: QualityController,
        target: "getHistoryOutputsWarehouseoOven"
    },
    {
        url: "/rovianda/history/report-trazability",
        method: "get",
        controller: QualityController,
        target: "getHistoryReportTrazability"
    },
    {
        url: "/rovianda/history/product-ended/oven",
        method: "get",
        controller: QualityController,
        target: "getHistoryProductEndedWarehouse"
    },
    {
        url: "/rovianda/history/product-ended",
        method: "get",
        controller: QualityController,
        target: "getHistoryProductEnded"
    },
    {
        url: "/rovianda/warehouses/inventory/:type",
        method: "get",
        controller: QualityController,
        target: "getInventoryOfQualityType"
    }
    ,
    {
        url: "/rovianda/quality/products-catalog",
        method: "get",
        controller: QualityController,
        target: "getAllProductCatalogByQuality"
    },
    {
        url: "/rovianda/quality/metrics/products-catalog",
        method: "get",
        controller: QualityController,
        target: "getAllProductCatalogWithMetrics"
    },
    {
        url: "/rovianda/quality/product-details/:productId",
        method: "get",
        controller: QualityController,
        target: "getProductQualitytDetails"
    },
    {
        url: "/rovianda/quality/product-presentations/:productId",
        method: "get",
        controller: QualityController,
        target: "getPresentationsActiveOfProduct"
    },
    {
        url: "/rovianda/quality/presentation-metrics/week/:presentationId",
        method: "get",
        controller: QualityController,
        target: "getChartMetricsPresentationWeek"
    },
    {
        url: "/rovianda/quality/sales-metrics/acumulated",
        method: "get",
        controller: QualityController,
        target: "getSalesMetricsAcumulated"
    },
    {
        url: "/rovianda/sales/general-data",
        method: "get",
        controller: QualityController,
        target: "getGeneralDataSalesChart"
    }
    ,
    {
        url: "/rovianda/quality/add-ingredient",
        method: "post",
        controller: QualityController,
        target: "addNewIngredient"
    },
    {
        url: "/rovianda/quality/vinculate-ingredient",
        method: "put",
        controller: QualityController,
        target: "vinculateIngredient"
    },
    {
        url: "/rovianda/quality/inventory-formulations",
        method: "get",
        controller: QualityController,
        target: "getInventoryFormulationsBySectionQuality"
    },
    {
        url: "/rovianda/quality/warehouses-outputs",
        method: "get",
        controller: QualityController,
        target: "getInventoryWarehouseOutputsBySectionQuality"
    },
    {
        url: "/rovianda/quality/process-records",
        method: "get",
        controller: QualityController,
        target: "getInventoryWarehousesProcessRecords"
    },
    {
        url: "/rovianda/quality/ovens-records",
        method: "get",
        controller: QualityController,
        target: "getInventoryWarehousesOvensRecords"
    },
    {
        url: "/rovianda/quality/product-ended/records",
        method: "get",
        controller: QualityController,
        target: "getInventoryWarehousesProductEnded"
    },
    {
        url: "/rovianda/quality/users-delivers",
        method: "get",
        controller: QualityController,
        target: "getAllUsersDelivers"
    },
    {
        url: "/rovianda/quality/delivery-sellers/records",
        method: "post",
        controller: QualityController,
        target: "getInventoryWarehouseDeliverySellersRecords"
    },
    {
        url: "/rovianda/quality/oven-status/:ovenId",
        method: "put",
        controller: QualityController,
        target: "updateStatusOfOvenProduct"
    },
    {
        url: "/rovianda/quality/records-entrances/:entranceId",
        method: "put",
        controller: QualityController,
        target: "updateRecordEntrancesByType"
    },
    {
        url: "/rovianda/quality/record-oven/:ovenId",
        method: "put",
        controller: QualityController,
        target: "updatePropertiesOven"
    },
    {
        url: "/rovianda/quality/code-access/:userId",
        method: "post",
        controller: QualityController,
        target: "createCodeAccess"
    },
    {
        url: "/rovianda/quality/code-access/:userId",
        method: "get",
        controller: QualityController,
        target: "getCodeAccessByUser"
    },
    {
        url: "/rovianda/quality/verify-code",
        method: "post",
        controller: QualityController,
        target: "verifyCodeAccess"
    }
];