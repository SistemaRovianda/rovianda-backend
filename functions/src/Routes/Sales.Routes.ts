import { routeInterface } from "../Models/Route.Interface";
import { SalesRequestController } from '../Controllers/Sales.Controller';

export const salesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/packaging",
        method:"get",
        controller:SalesRequestController,
        target:"getSalesRequest"
    }
];