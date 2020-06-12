import { routeInterface } from "../Models/Route.Interface";
import { UserController } from '../Controllers/User.Controller';

export const qualityRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/quality/user",
        method:"post",
        controller:UserController,
        target:"createUserF"
    },
    {
        url:"/rovianda/user/:uuid",
        method:"get",
        controller:UserController,
        target:"getUserById"
    },
    {
        url:"/rovianda/user",
        method:"get",
        controller:UserController,
        target:"getAllUsers"
    }
];