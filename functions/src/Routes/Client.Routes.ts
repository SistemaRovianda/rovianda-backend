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
    {
        url: "/rovianda/seller/customer/schedule/:clientId",
        method: "post",
        controller: ClientController,
        target: "createVisitToClient"    
    },
    {
        url: "/rovianda/seller/customer/schedule/:clientId",
        method: "put",
        controller: ClientController,
        target: "endVisitToClient"
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
    }
]