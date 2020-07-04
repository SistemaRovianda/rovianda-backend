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
    },{
        url:"/rovianda/maintenance/store",
        method:"post",
        controller:MaintenanceController,
        target:"saveStore"
    },{
        url:"/rovianda/maintenance/store",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceStore"
    },{
        url:"/rovianda/maintenance/mounth",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceMounth"
    },{
        url:"/rovianda/maintenance/device",
        method:"post",
        controller:MaintenanceController,
        target:"saveDevice"
    },{
        url:"/rovianda/maintenance/store/:store",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceByStore"
    },
    {
        url:"/rovianda/maintenance/:id",
        method:"put",
        controller:MaintenanceController,
        target:"uppdateMaintenance"
    },
    {
        url:"/rovianda/maintenance/object",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceObject"
    },{
        url:"/rovianda/maintenance/store",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceStore"
    },{
        url:"/rovianda/maintenance/mounth",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceMounth"
    },
    {
        url:"/rovianda/maintenance/mounth/:mounth",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceByMounth"
    },    {
        url:"/rovianda/maintenance/object/:object",
        method:"get",
        controller:MaintenanceController,
        target:"getMaintenanceByObject"
    }

];