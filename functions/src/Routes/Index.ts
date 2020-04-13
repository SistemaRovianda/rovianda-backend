import { routeInterface } from "../Models/Route.Interface";
import { Initializer } from '../Config/Initializer';
import  {entrancesMeatRoutes} from './Entrances.Meat.Routes';
import * as _ from 'lodash';
import { pinRoutes } from './Pin.Routes';
import { productRoutes } from './Product.Routes';

const init:Initializer = new Initializer();
const routes:Array<Array<routeInterface>>=[
    entrancesMeatRoutes,pinRoutes,productRoutes
];

export const routesToExpress: Array<routeInterface> = _.flattenDepth(routes,2).map((route:routeInterface)=>{
    route.controller = init.getController(route.controller.name);
    return route;
});