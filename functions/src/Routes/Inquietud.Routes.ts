import { routeInterface } from "../Models/Route.Interface";
import { ProductsRoviandaController } from '../Controllers/Products.Rovianda.Controller';
export const inquietudRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/product-rovianda",
        method:"post",
        controller:ProductsRoviandaController,
        target:"createCooling"
    },
    {
        url:"/rovianda/products-rovianda",
        method:"post",
        controller:ProductsRoviandaController,
        target:"closedCooling"
    },
    {
        url:"/rovianda/product-rovianda/:productId",
        method:"get",
        controller:ProductsRoviandaController,
        target:"createOutputsCooling"
    }
];