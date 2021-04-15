import { routeInterface } from "../Models/Route.Interface";
import { SalesRequestController } from '../Controllers/Sales.Controller';


export const salesRoutes:Array<routeInterface>=[
    {
        url: "/rovianda/sae/seller",
        method: "post",
        controller: SalesRequestController,
        target: "createSeller"
    },
    {
        url: "/rovianda/sae/seller-count",
        method:"get",
        controller: SalesRequestController,
        target: "getSellerCountKey"
    },
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
        url: "/rovianda/seller/orders-products/:orderId", // obtencion de productos de una orden es especifico ? mode=cheese
        method: "get",
        controller: SalesRequestController,
        target: "getProductOfOrderSeller"
    },
    {
        url: "/rovianda/seller/order/:orderId/product/:productId", // obtencion de presentaciones de un producto de una orden en especifico
        method: "get",
        controller: SalesRequestController,
        target: "getPresentationsOfProductOfOrderSellerApp"
    },
    {
        url: "/rovianda/seller/order/:orderId/products", // obtencion de presentaciones de un producto de una orden en especifico
        method: "get",
        controller: SalesRequestController,
        target: "getPresentationsOfProductOfOrderSeller"
    },
    {
        url: "/rovianda/order-details/:orderId",
        method: "get",
        controller: SalesRequestController,
        target: "getDetailsOfOrderSeller"
    },
    {
        url: "/rovianda/order-update/:orderId",
        method: "put",
        controller: SalesRequestController,
        target: "updateDetailsOfOrderSeller"
    }
    ,{
        url: "/rovianda/products-rovianda/catalog",
        method: "get",
        controller: SalesRequestController,
        target: "getAllProductRoviandaCatalog"
    },{
        url: "/rovianda/products-rovianda/catalog/:productId",
        method: "get",
        controller: SalesRequestController,
        target: "getAllProductRoviandaCatalogPresentation"
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
        url: "/rovianda/seller/clients-debts/:clientId", // obtiene los clientes de un vendedor que tienen deudas con él
        method: "get",
        controller: SalesRequestController,
        target: "getClientDebts"
    },{
        url: "/rovianda/seller-debts/:sellerId",
        method: "get",
        controller: SalesRequestController,
        target: "getDebtsOfClientsOfSeller"
    },{
        url: "/rovianda/seller-debts/:saleId",
        method: "post",
        controller: SalesRequestController,
        target: "payDebtsOfClientsOfSeller"
    }
    ,{
        url: "/rovianda/seller-clients/:sellerUid", // obtiene todos los clientes del vendedor
        method: "get",
        controller: SalesRequestController,
        target: "getAllClients"
    },
    {
        url: "/rovianda/seller/client/payment/:debId", // servicio para pagar una deuda de un cliente a un vendedor
        method: "post",
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
        url: "/rovianda/seller/eat/time/:sellerUid",
        method: "get",
        controller: SalesRequestController,
        target: "getCurrentTime"
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
        url: "/rovianda/seller/guard/:sellerUid", // obtiene el resguardo de un vendedor
        method: "get",
        controller: SalesRequestController,
        target: "getSellerGuard"
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
    },
    {
        url: "/rovianda/sale",
        method:"post",
        controller: SalesRequestController,
        target: "createSaleSae"
    },
    {
        url: "/rovianda/cancel-sale/:saleId",
        method: "put",
        controller: SalesRequestController,
        target: "cancelSale"
    }
    ,
    {
        url: "/rovianda/tax/schema",
        method: "get",
        controller: SalesRequestController,
        target: "getAllTaxScheme"
    },
    {
        url: "/rovianda/sale-ticket/:saleId",
        method: "get",
        controller: SalesRequestController,
        target: "getSaleTicket"
    },{
        url: "/rovianda/single-ticket/:saleId",
        method: "get",
        controller: SalesRequestController,
        target: "getSingleTicket"
    },{
        url: "/rovianda/day-ended/:sellerUid",
        method:"get",
        controller:SalesRequestController,
        target: "endDaySeller"
    },
    {
        url: "/rovianda/ticket-sale-deb/:debId",
        method:"get",
        controller:SalesRequestController,
        target: "ticketDebSeller"
    },
    {
        url: "/rovianda/sales-superadmin/sales",
        method:"post",
        controller: SalesRequestController,
        target: "getAllSalesSuperadmin"
    },
    {
        url: "/rovianda/sales-history/:sellerUid",
        method: "get",
        controller: SalesRequestController,
        target: "getAllSalesOfDayOfSeller"
    },
    {
        url:"/rovianda/sales-superadmin/del",
        method:"post",
        controller:SalesRequestController,
        target:"delSalesBySuperAdmin"
    },
    {
        url:"/rovianda/sales-superadmin/report-deleted",
        method:"post",
        controller:SalesRequestController,
        target:"getDelSalesBySuperAdmin"
    },
    {
        url:"/rovianda/sales-superadmin/super-sales",
        method:"post",
        controller:SalesRequestController,
        target:"tranfersSalesToSaes"
    },
    {
        url: "/rovianda/sales-product/:sellerUid/:key",
        method:"get",
        controller:SalesRequestController,
        target:"getProductByKeyToSale"
    },
    {
        url: "/rovianda/inve-product/:key",
        method: "get",
        controller: SalesRequestController,
        target: "getProductsInfoOfInventStock"
    },
    {
        url: "/rovianda/sellers-list",
        method: "get",
        controller: SalesRequestController,
        target:"getListOfSellers"
    },
    {
        url: "/rovianda/seller-resguarded/:sellerUid",
        method: "get",
        controller: SalesRequestController,
        target: "getResguardedOfSeller"
    },
    {
        url: "/rovianda/get-status/sales/:sellerId",
        method: "get",
        controller: SalesRequestController,
        target: "getStatusSale"
    },{
        url: "/rovianda/supertranfer",
        method:"get",
        controller: SalesRequestController,
        target: "initTransfer"
    },
    {
        url: "/rovianda/getstock/:sellerId",
        method: "get",
        controller: SalesRequestController,
        target: "getStatusStockOffline"
    },
    {
        url: "/rovianda/accumulated/sales",
        method: "get",
        controller: SalesRequestController,
        target: "getAcumulatedSales"
    }
];