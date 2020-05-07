import { routeInterface } from "../Models/Route.Interface";
import { FormulationController } from "../Controllers/Formulation.Controller";

export const formulationRoutes: Array<routeInterface>=[
    {
        url: "/rovianda/formulation",
        method: "post",
        controller: FormulationController,
        target: "createFormulation"
    }
]