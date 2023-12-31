import { WarehouseController } from "../Controllers/Warehouse.Controller";
import { routeInterface } from "../Models/Route.Interface";

export const WarehouseRoutes:Array<routeInterface>=[
    {
        url: "/rovianda/warehouse",
        method: "post",
        controller: WarehouseController,
        target:"createWarehouse"
    },
    {
        url: "/rovianda/warehouses",
        method: "get",
        controller: WarehouseController,
        target: "getAllWarehouse"
    },
    {
        url: "/rovianda/warehouse/:warehouseSaeId",
        method:"get",
        controller: WarehouseController,
        target: "getMetricsEntranceByDate"
    },
    {
        url: "/rovianda/update/users",
        method: "get",
        controller: WarehouseController,
        target: "updateUsersCreationDate"
    }
];