import { routeInterface } from "../Models/Route.Interface";
import { ProductController } from '../Controllers/Product.Controller';

export const productRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/products/:type",
        method:"get",
        controller:ProductController,
        target:"getAllProductsCatalogByType"
    },
    {
        url:"/rovianda/product-catalog",
        method:"post",
        controller:ProductController,
        target:"createProductCatalog"
    }
    ,
    /*{
        url:"/rovianda/product-rovianda",
        method:"post",
        controller: ProductController,
        target:"createProductRovianda"
    },*/
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
    },
    {
        url:"/rovianda/products/lot/:lotId",
        method:"get",
        controller: ProductController,
        target:"getProductsByLotId"
    },
    {
        url:"/rovianda/packaging/products/presentations/:productRoviandaId",
        method: "get",
        controller: ProductController,
        target: "getProductsPresentationByRoviandaId"
    },
    {
        url:"/rovianda/product/rovianda",
        method: "post",
        controller: ProductController,
        target: "saveProductRovianda"
    },
    {
        url:"/rovianda/add/ingredient",
        method: "post",
        controller: ProductController,
        target: "addIngredent"
    },
    {
        url:"/rovianda/list/ingredients",
        method: "get",
        controller: ProductController,
        target: "getAllIngredents"
    },
    {
        url:"/rovianda/ingredient/:ingredientId",
        method: "delete",
        controller: ProductController,
        target: "deleteIngredent"
    },
    {
        url:"/rovianda/product/rovianda",
        method: "get",
        controller: ProductController,
        target: "getAllProductRovianda"
    },
    {
        url:"/rovianda/product/rovianda/:roviandaId",
        method: "delete",
        controller: ProductController,
        target: "deleteProductRoviandaLogic"
    },
    {
        url:"/rovianda/product/:presentationId",
        method: "delete",
        controller: ProductController,
        target: "deletePresentation"
    },
    {
        url:"/rovianda/product-presentation/:presentationId",
        method: "get",
        controller: ProductController,
        target: "getPresentation"
    },{
        url:"/rovianda/product/rovianda/:roviandaId",
        method: "get",
        controller: ProductController,
        target: "getProductRoviandaByRoviandaId"
    },{
        url:"/rovianda/product/rovianda/:productId",
        method: "put",
        controller: ProductController,
        target: "updateProductRovianda"
    },{
        url:"/rovianda/search/productRovianda",
        method: "get",
        controller: ProductController,
        target: "getProductRoviandaByCode"
    },
    {
        url: "/rovianda/sae/get-products/lines",
        method: "get",
        controller: ProductController,
        target: "getProductsLines"
    },{
        url: "/rovianda/sae/delete-products/lines/:cve",
        method: "delete",
        controller: ProductController,
        target: "deleteProductsLines"
    },{
        url: "/rovianda/sae/list-clients",
        method: "get",
        controller: ProductController,
        target: "getClientSaeList"
    },
    {
        url: "/rovianda/sales-clients/:clientId",
        method: "get",
        controller: ProductController,
        target: "getSalesOfClient"
    },
    {
        url: "/rovianda/sae/product/line",
        method: "post",
        controller: ProductController,
        target: "createProductLine"
    },
    {
        url: "/rovianda/sae/product/lines",
        method: "get",
        controller: ProductController,
        target: "getAllProductsLines"
    }
];