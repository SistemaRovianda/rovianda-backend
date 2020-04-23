import { routeInterface } from "../Models/Route.Interface";
import { ProcessController } from '../Controllers/Process.Controller';
import { ConditioningController } from '../Controllers/Conditioning.Controller';
import { TenderizedController } from "../Controllers/Tenderized.Controller";
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
        target:"getAllProcess"
    },{
        url:"/rovianda/process/conditioning/:processid",
        method:"post",
        controller:ConditioningController,
        target:"createConditioning"
    },{
        url:"/rovianda/process/conditioning/:processid",
        method:"get",
        controller:ConditioningController,
        target:"getConditioning"
    },{
        url:"/process/injection-tenderized/:processid",
        method:"post",
        controller:TenderizedController,
        target:"createTenderized"
    },{
        url:"/process/injection-tenderized/:processid",
        method:"get",
        controller:TenderizedController,
        target:"getTenderized"
    }
];