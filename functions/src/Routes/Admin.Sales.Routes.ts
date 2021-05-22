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
    }
];