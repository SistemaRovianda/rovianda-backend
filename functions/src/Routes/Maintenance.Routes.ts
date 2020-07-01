import { routeInterface } from "../Models/Route.Interface";
import { MaintenanceController } from '../Controllers/Maintenance.Controller';
export const maintenanceRoutes:Array<routeInterface>=[


    {
        url:"/rovianda/maintenance",
        method:"get",
        controller:MaintenanceController,
        target:"getAllMaintenance"
    }
];