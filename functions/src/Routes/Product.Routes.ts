import { routeInterface } from "../Models/Route.Interface";
import { ProductController } from '../Controllers/Product.Controller';

export const productRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/products",
        method:"get",
        controller:ProductController,
        target:"getAllProducts"
    }
];