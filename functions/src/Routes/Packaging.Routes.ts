import { routeInterface } from "../Models/Route.Interface";
import { PackagingController } from '../Controllers/Packaging.Controller';
export const packagingRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/packaging",
        method:"post",
        controller:PackagingController,
        target:"savePackaging"
    },{
        url:"/rovianda/pack",
        method:"get",
        controller:PackagingController,
        target:"getProducts" 
    }
];