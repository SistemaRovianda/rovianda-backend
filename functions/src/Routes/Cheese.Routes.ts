import { CheeseController } from "../Controllers/Cheese.Controller";
import { routeInterface } from "../Models/Route.Interface";

export const CheeseRoutes:Array<routeInterface>=[

    {
        url: "/rovianda/cheese",
        method:"post",
        controller: CheeseController,
        target: "createCheese"
    },
    {
        url: "/rovianda/cheeses",
        method:"get",
        controller: CheeseController,
        target: "getAllCheeses"
    },
    {
        url: "/rovianda/udpdate-cheese",
        method: "put",
        controller: CheeseController,
        target: "updateCheeseStock"
    }

];