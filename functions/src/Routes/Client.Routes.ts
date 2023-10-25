import { routeInterface } from "../Models/Route.Interface";
import { ClientController } from "../Controllers/Client.Controller";

export const clientRoutes: Array<routeInterface> = [
    {
        url: "/rovianda/customer/create",//DONE
        method: "post",
        controller: ClientController,
        target: "createCustomer"
    },
    {
        url: "/rovianda/seller/customer/create",//DONE
        method: "post",
        controller: ClientController,
        target: "createSellerCustomer"
    },
    {
        url: "/rovianda/seller/customer/schedule",//DONE
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
        url: "/rovianda/seller/customer/schedule/:clientId",//DONE
        method: "put",
        controller: ClientController,
        target: "endVisitToClient"
    },
    {
        url: "/rovianda/customer/reassign",//DONE
        method: "put",
        controller: ClientController,
        target: "customerReassign"
    },
    {
        url: "/rovianda/customer/customer-count",//DONE
        method: "get",
        controller: ClientController,
        target: "getCustomerCount"
    },
    {
        url:"/rovianda/customer/client-key/:key",//DONE
        method:"get",
        controller: ClientController,
        target: "getClientByKey"
    },
    {
        url: "/rovianda/customer/delete-client/:id",//DONE
        method: "delete",
        controller: ClientController,
        target: "deleteClient"
    },{
        url: "/rovianda/update-client/:clientId",//DONE
        method: "put",
        controller: ClientController,
        target: "updateKeySaeClient"
    },
    {
        url: "/rovianda/client/sae/search/:code",//DONE
        method: "get",
        controller: ClientController,
        target: "searchClientByCodeSae"
    },
    {
        url: "/rovianda/customers-report/sellers",//DONE
        method: "get",
        controller: ClientController,
        target: "getCustomerReportBySeller"
    },
    {
        url: "/rovianda/customers/v2/register",//DONE
        method: "post",
        controller: ClientController,
        target: "registerCustomerV2"
    },
    {
        url: "/rovianda/customers/v2/register-arr",//DONE
        method: "post",
        controller: ClientController,
        target: "registerCustomerV2Arr"
    },
    {
        "url":"/rovianda/customer/v2/sychronization",//DONE
        method:"post",
        controller: ClientController,
        target: "synchronizationCustomersV2"
    },
    {
        url: "/rovianda/customers/v2/update",//DONE
        method: "post",
        controller: ClientController,
        target: "updateCustomerV2"
    },
    {
        url: "/rovianda/customer/visit",//DONE
        method: "post",
        controller: ClientController,
        target: "createVisit"
    },
    {
        url: "/rovianda/customer/visits",//DONE
        method: "post",
        controller:ClientController,
        target: "getVisitsBySellerAndDate"
    },
    {
        url: "/rovianda/customer/visits-report",//DONE
        method: "post",
        controller:ClientController,
        target: "getVisitsBySellerAndDateReport"
    }
]