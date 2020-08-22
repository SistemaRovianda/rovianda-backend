import { routeInterface } from "../Models/Route.Interface";
import { SalesRequestController } from '../Controllers/Sales.Controller';

export const salesRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/packaging",
        method:"get",
        controller:SalesRequestController,
        target:"getSalesRequest"
    },{
        url:"/rovianda/seller/order/:sellerUid", // creacion de una orden de vendedor
        method:"post",
        controller:SalesRequestController,
        target:"saveOrderSeller"
    },
    {
        url:"/rovianda/seller/orders/:sellerUid", // obtencion de la ordenes de un vendedor
        method: "get",
        controller: SalesRequestController,
        target: "getOrdersOfSeller"
    },
    {
        url: "/rovianda/seller/orders-products/:orderId", // obtencion de productos de una orden es especifico
        method: "get",
        controller: SalesRequestController,
        target: "getProductOfOrderSeller"
    },
    {
        url: "/rovianda/seller/order/:orderId/product/:productId", // obtencion de presentaciones de un producto de una orden en especifico
        method: "get",
        controller: SalesRequestController,
        target: "getPresentationsOfProductOfOrderSeller"
    },
    {
        url: "/rovianda/packaging/inventory", // obtencion de inventario de productos disponibles en rovianda
        method: "get",
        controller: SalesRequestController,
        target: "getSellerPackagingInventory"
    },
    {
        url: "/rovianda/packaging/inventory/product/:productId", // obtencion de presentaciones de productos disponibles en rovianda
        method: "get",
        controller: SalesRequestController,
        target: "getSellerPackagingInventoryProduct"
    },
    {
        url: "/rovianda/seller/inventory/:sellerUid", // obtencion de productos en inventario del vendedor
        method:"get",
        controller: SalesRequestController,
        target: "getSellerInventory"
    },
    {
        url: "/rovianda/seller/inventory/:sellerUid/product/:productId", // obtiene las presentaciones de un producto en el inventario del vendedor
        method: "get",
        controller: SalesRequestController,
        target: "getSellerInventoryProduct"
    },
    {
        url: "/rovianda/seller/clients/:sellerUid", // obtiene los clientes de un vendedor que tienen deudas con él
        method: "get",
        controller: SalesRequestController,
        target: "getClientPending"
    },
    {
        url: "/rovianda/seller/client/payment/:debId", // servicio para pagar una deuda de un cliente a un vendedor
        method: "patch",
        controller: SalesRequestController,
        target: "payDebPending"
    },
    {
        url: "/rovianda/seller/eat/time", 
        method: "post",
        controller: SalesRequestController,
        target: "saveSellerOperation"
    },
    {
        url: "/rovianda/seller/eat/:sellerUid", 
        method: "patch",
        controller: SalesRequestController,
        target: "updateHourSellerOperation"
    },
    {
        url: "/rovianda/report/times/movements/:sellerUid", 
        method: "get",
        controller: SalesRequestController,
        target: "timesMovents"
    },
    {
        url: "/rovianda/report/sale/client/:sellerUid/:saleId", 
        method: "get",
        controller: SalesRequestController,
        target: "saleClient"
    },
    {
        url: "/rovianda/report/sales/:sellerUid", 
        method: "get",
        controller: SalesRequestController,
        target: "reportSales"
    }

];