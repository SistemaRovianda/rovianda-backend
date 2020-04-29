import { routeInterface } from "../Models/Route.Interface";
import { ProductController } from '../Controllers/Product.Controller';

export const productRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/products/:type",
        method:"get",
        controller:ProductController,
        target:"getAllProducts"
    },
    {
        url:"/rovianda/product-catalog",
        method:"post",
        controller:ProductController,
        target:"createProduct"
    }
];