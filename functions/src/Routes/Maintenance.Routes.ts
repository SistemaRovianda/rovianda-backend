import { routeInterface } from "../Models/Route.Interface";
import { MaintenanceController } from '../Controllers/Maintenance.Controller';
export const maintenanceRoutes:Array<routeInterface>=[


    {
        url:"/rovianda/maintenance",
        method:"get",
        controller:MaintenanceController,
        target:"getAllMaintenance"
    },{
        url:"/rovianda/maintenance",
        method:"post",
        controller:MaintenanceController,
        target:"createMaintenance"
    },
    {
        url:"/rovianda/maintenance/store",
        method:"post",
        controller:MaintenanceController,
        target:"saveStore"
    },
    {
        url:"/rovianda/maintenance/device",
        method:"post",
        controller:MaintenanceController,
        target:"saveDevice"
    },
    {
        url:"/rovianda/maintenance/store/:store",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceByStore"
    }
];