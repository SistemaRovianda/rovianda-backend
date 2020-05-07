
import { routeInterface } from "../Models/Route.Interface";
import { OvenController } from '../Controllers/Oven.Controller';
export const ovenRoutes: Array<routeInterface> = [
    {
        url: "/rovianda/oven/product/:productId",
        method: "patch",
        controller: OvenController,
        target: "updateOvenProduct"
    },
    {
        url: "/rovianda/oven/product/:productId",
        method: "get",
        controller: OvenController,
        target: "getOvenProductsByProductId"
    },
    {
        url: "/rovianda/oven/product",
        method: "post",
        controller: OvenController,
        target: "saveOvenProduct"
    }

];