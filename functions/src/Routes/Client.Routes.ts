import { routeInterface } from "../Models/Route.Interface";
import { ClientController } from "../Controllers/Client.Controller";

export const clientRoutes: Array<routeInterface> = [
    {
        url: "/rovianda/customer/create",
        method: "post",
        controller: ClientController,
        target: "createCustomer"
    }
]