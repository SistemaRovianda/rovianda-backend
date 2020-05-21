 import { routeInterface } from "../Models/Route.Interface";
 import { EntranceDriefController } from '../Controllers/Entrances.Drief.Controller';
 export const driefRoutes:Array<routeInterface>=[


    {
         url:"/rovianda/ingredients/lots",
         method:"get",
         controller:EntranceDriefController,
         target:"getOutputsDriefIngredients"
     }
];