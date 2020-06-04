import { routeInterface } from "../Models/Route.Interface";
import { InspectionController } from '../Controllers/Inspection.Controller';

export const inspectionRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/quality/users/:inspectionId",
        method:"get",
        controller:InspectionController,
        target:"getUserInspection"
    },{
        url:"/rovianda/quality/inspection",
        method:"post",
        controller:InspectionController,
        target:"createInspection" 
    },{
        url:"/rovianda/quality/users/:inspectionId",
        method:"post",
        controller:InspectionController,
        target:"createInspectionUsers" 
    }

];