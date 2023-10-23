import { AdminSalesController } from "../Controllers/Admin.Sales.Controller";
import { UserController } from "../Controllers/User.Controller";
import { routeInterface } from "../Models/Route.Interface";

export const AdminSalesRoutes:routeInterface[]=[
    {  
        url: "/rovianda/admin-sales/sellers", //DONE
        controller: AdminSalesController,
        method: "get",
        target: "getOnlySellers"
    },
    {
        url: "/rovianda/seller-client/:clientId",//DONE
        controller: AdminSalesController,
        method: "put",
        target: "updateSellerClient"
    },
    {
        url: "/rovianda/get-days-visit/:clientId",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getDaysVisitsByClient"
    },
    {
        url: "/rovianda/client-register/last-count",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getLastCountClient"
    },
    {
        url: "/rovianda/admin-sales/client/:sellerId",//DONE
        controller: AdminSalesController,
        method: "post",
        target: "createClientCount"
    },
    {
        url: "/rovianda/client-delete/:clientId",//DONE
        controller: AdminSalesController,
        method: "delete",
        target: "deleteLoginClient"
    },
    {
        url: "/rovianda/report/seller/summary/:sellerId",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getSummaryReportBySeller"
    },
    {
        url: "/rovianda/admin-sales/allclients",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getAllClientsToAdminSales"
    },
    {
        url: "/rovianda/admin-sales/allproducts",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getAllProductsToAdminSales"
    },
    {
        url: "/rovianda/report/general/admin-sales",//DONE
        controller: AdminSalesController,
        method: "post",
        target: "getGeneralReportSales"
    },
    {
        url: '/rovianda/metrics/general/admin-sales',//DONE
        controller: AdminSalesController,
        method: 'get',
        target: 'getGeneralChartDataSales'
    },
    {
        url: '/rovianda/metrics/report/general/admin-sales',//DONE
        controller: AdminSalesController,
        method: 'get',
        target: 'getGeneralChartDataSalesReport'
    }
    ,
    {
        url: '/rovianda/metrics/general/rankin-sellers/:presentationId',//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsRankingSellersByProduct"
    },{
        url: '/rovianda/metrics/report/general/rankin-sellers/:presentationId',//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsrReportRankingSellersByProduct"
    },
    {
        url: "/rovianda/metrics/general/ranking/sellers",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getMetricsRankingSellers"
    },
    {
        url: "/rovianda/report/metrics/general/ranking/sellers",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getReportMetricsRankingSellers"
    },
    {
        url: "/rovianda/sincronization/:sellerId",//DONE
        controller: AdminSalesController,
        method: "get",
        target: "getDataInitial"
    },
    {
        url: "/rovianda/presale/sincronization/:sellerId",
        controller: AdminSalesController,
        method: "get",
        target: "getDataInitialForPresales"
    },
    {
        url: "/rovianda/delivers/update-presale",
        controller: AdminSalesController,
        method: "put",
        target: "updatePresaleInfoForSale"
    },
    {
        url: "/rovianda/delivers/register-debt",
        controller: AdminSalesController,
        method: "post",
        target: "registerDebtOfDeliver"
    },
    {
        url:"/rovianda/delivers/sincronization/:sellerId",
        controller:AdminSalesController,
        method:"get",
        target: "getDataInitialForDeliversOfPresales"
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
    },
    {
        url: "/rovianda/user-password",
        method: "post",
        controller: UserController,
        target: "updateUserPassword"
    },
    {
        url: "/rovianda/user-register",
        method: "post",
        controller: UserController,
        target: "userRegister"
    },
    {
        url: "/rovianda/simple-user/details/:uid",
        method: "get",
        controller: UserController,
        target: "simpleUserDetails"
    },
    {
        url: "/rovianda/simple-user/update/:uid",
        method:"put",
        controller: UserController,
        target: "simpleUserUpdate"
    },
    {
        url: "/rovianda/user-seller/register",
        method: "post",
        controller: UserController,
        target: "userRegisterSeller"
    },
    {
        url: "/rovianda/user-seller/details/:uid",
        method: "get",
        controller: UserController,
        target: "sellerUserDetails"
    },
    {
        url:"/rovianda/user-seller/update/:uid",
        method:"put",
        controller: UserController,
        target: "sellerUserUpdate"
    },
    {
        url: "/rovianda/user-presale/register",
        method: "post",
        controller: UserController,
        target: "createPreSaleUser"
    },
    {
        url: "/rovianda/user-presale/details/:uid",
        method: "get",
        controller: UserController,
        target: "preSaleUserDetails"
    },
    {
        url: "/rovianda/user-presale/update/:uid",
        method:"put",
        controller: UserController,
        target: "preSaleUserUpdate"
    }
];