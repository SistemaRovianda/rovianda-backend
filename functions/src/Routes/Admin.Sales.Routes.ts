import { AdminSalesController } from "../Controllers/Admin.Sales.Controller";
import { routeInterface } from "../Models/Route.Interface";

export const AdminSalesRoutes:routeInterface[]=[
    {  
        url: "/rovianda/admin-sales/sellers",
        controller: AdminSalesController,
        method: "get",
        target: "getOnlySellers"
    },
    {
        url: "/rovianda/seller-client/:clientId",
        controller: AdminSalesController,
        method: "put",
        target: "updateSellerClient"
    },
    {
        url: "/rovianda/get-days-visit/:clientId",
        controller: AdminSalesController,
        method: "get",
        target: "getDaysVisitsByClient"
    },
    {
        url: "/rovianda/client-register/last-count",
        controller: AdminSalesController,
        method: "get",
        target: "getLastCountClient"
    },
    {
        url: "/rovianda/admin-sales/client/:sellerId",
        controller: AdminSalesController,
        method: "post",
        target: "createClientCount"
    },
    {
        url: "/rovianda/client-delete/:clientId",
        controller: AdminSalesController,
        method: "delete",
        target: "deleteLoginClient"
    },
    {
        url: "/rovianda/report/seller/summary/:sellerId",
        controller: AdminSalesController,
        method: "get",
        target: "getSummaryReportBySeller"
    },
    {
        url: "/rovianda/admin-sales/allclients",
        controller: AdminSalesController,
        method: "get",
        target: "getAllClientsToAdminSales"
    },
    {
        url: "/rovianda/admin-sales/allproducts",
        controller: AdminSalesController,
        method: "get",
        target: "getAllProductsToAdminSales"
    },
    {
        url: "/rovianda/report/general/admin-sales",
        controller: AdminSalesController,
        method: "post",
        target: "getGeneralReportSales"
    },
    {
        url: '/rovianda/metrics/general/admin-sales',
        controller: AdminSalesController,
        method: 'get',
        target: 'getGeneralChartDataSales'
    },
    {
        url: '/rovianda/metrics/report/general/admin-sales',
        controller: AdminSalesController,
        method: 'get',
        target: 'getGeneralChartDataSalesReport'
    }
    ,
    {
        url: '/rovianda/metrics/general/rankin-sellers/:presentationId',
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsRankingSellersByProduct"
    },{
        url: '/rovianda/metrics/report/general/rankin-sellers/:presentationId',
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsrReportRankingSellersByProduct"
    },
    {
        url: "/rovianda/metrics/general/ranking/sellers",
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsRankingSellers"
    },
    {
        url: "/rovianda/report/metrics/general/ranking/sellers",
        controller: AdminSalesController,
        method: "get",
        target: "getReportMetricsRankingSellers"
    },
    {
        url: "/rovianda/sincronization/:sellerId",
        controller: AdminSalesController,
        method: "get",
        target: "getDataInitial"
    },
    {
        url: "/rovianda/status-sincronized/client",
        controller: AdminSalesController,
        method: "post",
        target: "updateStatusSincronizedClient"
    },
    {
        url: "/rovianda/cancel-reactivate/:saleId",
        controller: AdminSalesController,
        method: "put",
        target: "cancelReactivateSale"
    },
    {
        url: "/rovianda/report/sales-types",
        method: "post",
        controller: AdminSalesController,
        target: "reportTypeSales"
    },
    {
        url: "/rovianda/set-token/:uid",
        method: "put",
        controller: AdminSalesController,
        target: "setUserToken"
    },
    {
        url: "/rovianda/set-token/:uid",
        method: "delete",
        controller: AdminSalesController,
        target: "setUserToken"
    },
    {
        url: "/rovianda/admin-sales/get-cancelations",
        method: "get",
        controller: AdminSalesController,
        target: "getCancelationsRequest"
    },
    {
        url: "/rovianda/admin-sales/get-devolutions",
        method: "get",
        controller: AdminSalesController,
        target: "getDevolutionsRequest"
    },
    {
        url: "/rovianda/update-sale/request/:saleId",
        method: "put",
        controller: AdminSalesController,
        target: "updateCancelRequest"
    },
    {
        url: "/rovianda/update-sale/request-devolution/:saleId",
        method: "put",
        controller: AdminSalesController,
        target: "updateDevolutionRequest"
    },
    {
        url: "/rovianda/admin-products/catalog",
        method: "post",
        controller: AdminSalesController,
        target: "getAllProductsRoviandaCatalog"
    },
    {
        url: "/rovianda/admin-products/find-preregister",
        method: "get",
        controller: AdminSalesController,
        target: "getPreregisterProduct"
    },
    {
        url: "/rovianda/admin-products/regist-preregister",
        method: "post",
        controller: AdminSalesController,
        target: "registerPreRegisterProduct"
    },
    {
        url: "/rovianda/admin-products/update/:presentationId",
        method: "put",
        controller: AdminSalesController,
        target: "updatePreRegisterProduct"
    },
    {
        url: "/rovianda/admin-products/delete/:presentationId",
        method: "delete",
        controller: AdminSalesController,
        target: "deletePreRegisterProduct"
    }
];