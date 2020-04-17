import { routeInterface } from "../Models/Route.Interface";
import { ProcessController } from '../Controllers/Process.Controller';
import { ConditioningController } from '../Controllers/Conditioning.Controller';
export const processRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/process",
        method:"post",
        controller:ProcessController,
        target:"createProcess"
    },{
        url:"/rovianda/process",
        method:"get",
        controller:ProcessController,
        target:"getProcessActive"
    },{
        url:"/rovianda/process/conditioning/:processid",
        method:"post",
        controller:ConditioningController,
        target:"createConditioning"
    }
];