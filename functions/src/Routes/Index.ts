import { routeInterface } from "../Models/Route.Interface";
import { pinRoutes } from './Pin.Routes';
import { fridgesRoutes } from './Fridges.Routes';
import  {entrancesMeatRoutes} from './Entrances.Meat.Routes';
import { Initializer } from '../Config/Initializer';
import * as _ from 'lodash';
import { productRoutes } from './Product.Routes';

const init:Initializer = new Initializer();
const routes:Array<Array<routeInterface>>=[
    entrancesMeatRoutes,pinRoutes,productRoutes,fridgesRoutes,entrancesMeatRoutes
];

export const routesToExpress: Array<routeInterface> = _.flattenDepth(routes,2).map((route:routeInterface)=>{
    route.controller = init.getController(route.controller.name);
    return route;
});