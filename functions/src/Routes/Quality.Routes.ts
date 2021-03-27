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
    },
    {
        url:"/rovianda/token",
        method:"get",
        controller:UserController,
        target:"createToken"
    },
    {
        url:"/rovianda/user/rol/:rol",
        method:"get",
        controller:UserController,
        target:"getUserByRol"
    },
    {
        url: "/rovianda/user-status",
        method: "put",
        controller: UserController,
        target: "updateUserStatus"
    }
];