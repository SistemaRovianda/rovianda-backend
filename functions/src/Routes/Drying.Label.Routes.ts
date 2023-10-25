import { routeInterface } from "../Models/Route.Interface";
import { DryngLabelController } from '../Controllers/Dryng.Label.Controller';

export const dryngLabelRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/drying",//DONE
        method:"post",
        controller:DryngLabelController,
        target:"createDringLabel"
    },
    {
        url:"/rovianda/drying/:id",//DONE
        method:"get",
        controller:DryngLabelController,
        target:"getDryngLabelById"
    }
];