import { routeInterface } from "../Models/Route.Interface";
import { InspectionController } from '../Controllers/Inspection.Controller';

export const inspectionRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/quality/users/:inspectionId",
        method:"get",
        controller:InspectionController,
        target:"getUserInspection"
    },
    {
        url:"/rovianda/users/:inspectionId",
        method:"post",
        controller:InspectionController,
        target:"getDryngLabelById"
    }
];