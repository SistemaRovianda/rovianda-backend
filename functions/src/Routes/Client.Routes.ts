import { routeInterface } from "../Models/Route.Interface";
import { ClientController } from "../Controllers/Client.Controller";

export const clientRoutes: Array<routeInterface> = [
    {
        url: "/rovianda/customer/create",
        method: "post",
        controller: ClientController,
        target: "createCustomer"
    },
    {
        url: "/rovianda/seller/customer/create",
        method: "post",
        controller: ClientController,
        target: "createSellerCustomer"
    },
    {
        url: "/rovianda/seller/customer/schedule",
        method: "get",
        controller: ClientController,
        target: "getScheduleCustomerBySeller"
    },
    /*{
        url: "/rovianda/seller/customer/schedule/:clientId",
        method: "post",
        controller: ClientController,
        target: "createVisitToClient"    
    },*/
    {
        url: "/rovianda/seller/customer/schedule/:clientId",
        method: "put",
        controller: ClientController,
        target: "endVisitToClient"
    },
    {
        url: "/rovianda/customer/reassign",
        method: "put",
        controller: ClientController,
        target: "customerReassign"
    },
    {
        url: "/rovianda/customer/customer-count",
        method: "get",
        controller: ClientController,
        target: "getCustomerCount"
    },
    {
        url:"/rovianda/customer/client-key/:key",
        method:"get",
        controller: ClientController,
        target: "getClientByKey"
    },
    {
        url: "/rovianda/customer/delete-client/:id",
        method: "delete",
        controller: ClientController,
        target: "deleteClient"
    },{
        url: "/rovianda/update-client/:clientId",
        method: "put",
        controller: ClientController,
        target: "updateKeySaeClient"
    },
    {
        url: "/rovianda/client/sae/search/:code",
        method: "get",
        controller: ClientController,
        target: "searchClientByCodeSae"
    },
    {
        url: "/rovianda/customers-report/sellers",
        method: "get",
        controller: ClientController,
        target: "getCustomerReportBySeller"
    },
    {
        url: "/rovianda/customers/v2/register",
        method: "post",
        controller: ClientController,
        target: "registerCustomerV2"
    },
    {
        url: "/rovianda/customers/v2/register-arr",
        method: "post",
        controller: ClientController,
        target: "registerCustomerV2Arr"
    },
    {
        "url":"/rovianda/customer/v2/sychronization",
        method:"post",
        controller: ClientController,
        target: "synchronizationCustomersV2"
    },
    {
        url: "/rovianda/customers/v2/update",
        method: "post",
        controller: ClientController,
        target: "updateCustomerV2"
    },
    {
        url: "/rovianda/customer/visit",
        method: "post",
        controller: ClientController,
        target: "createVisit"
    },
    {
        url: "/rovianda/customer/visits",
        method: "post",
        controller:ClientController,
        target: "getVisitsBySellerAndDate"
    },
    {
        url: "/rovianda/customer/visits-report",
        method: "post",
        controller:ClientController,
        target: "getVisitsBySellerAndDateReport"
    }
]