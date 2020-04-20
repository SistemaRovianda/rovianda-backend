import { routeInterface } from "../Models/Route.Interface";
import { pinRoutes } from './Pin.Routes';
import { fridgesRoutes } from './Fridges.Routes';
import { lotRoutes } from './Lot.Routes';
import { driefRoutes } from './Drief.Routes';
import { Initializer } from '../Config/Initializer';
import  {entrancesRoutes} from './Entrances.Routes';
import * as _ from 'lodash';
import { productRoutes } from './Product.Routes';
import { processRoutes } from './Process.Routes';
import { inquietudRoutes } from "./Inquietud.Routes";

const init:Initializer = new Initializer();
const routes:Array<Array<routeInterface>>=[
    pinRoutes,fridgesRoutes,lotRoutes,productRoutes,driefRoutes,entrancesRoutes,processRoutes,inquietudRoutes
];

export const routesToExpress: Array<routeInterface> = _.flattenDepth(routes,2).map((route:routeInterface)=>{
    route.controller = init.getController(route.controller.name);
    return route;
});