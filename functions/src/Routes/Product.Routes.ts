import { routeInterface } from "../Models/Route.Interface";
import { ProductController } from '../Controllers/Product.Controller';

export const productRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/products/:type",
        method:"get",
        controller:ProductController,
        target:"getAllProductsCatalog"
    },
    {
        url:"/rovianda/product-catalog",
        method:"post",
        controller:ProductController,
        target:"createProductCatalog"
    },
    {
        url:"/rovianda/product-rovianda",
        method:"post",
        controller: ProductController,
        target:"createProductRovianda"
    },
    {
        url:"/rovianda/product-rovianda/:productId",
        method:"get",
        controller: ProductController,
        target:"getProductRovianda"
    },
    {
        url:"/rovianda/product-rovianda/:productId",
        method:"delete",
        controller:ProductController,
        target:"deleteProductRovianda"
    },
    {
        url:"/rovianda/products-rovianda",
        method:"get",
        controller: ProductController,
        target:"getAllProductsRovianda"
    }
];