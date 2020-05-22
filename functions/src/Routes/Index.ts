import { routeInterface } from "../Models/Route.Interface";
import { pinRoutes } from './Pin.Routes';
import { fridgesRoutes } from './Fridges.Routes';
import { lotRoutes } from './Lot.Routes';
import { Initializer } from '../Config/Initializer';
import  {entrancesRoutes} from './Entrances.Routes';
import * as _ from 'lodash';
import { productRoutes } from './Product.Routes';
import { processRoutes } from './Process.Routes';
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { ovenRoutes } from "./Oven.Routes";
import { formulationRoutes } from "./Formulation.Routes";
import { packagingRoutes } from './Packaging.Routes';
import { qualityRoutes } from "./Quality.Routes";
import { dryngLabelRoutes } from "./Drying.Label.Routes";

const init:Initializer = new Initializer();
const routes:Array<Array<routeInterface>>=[
    pinRoutes,fridgesRoutes,lotRoutes,productRoutes,entrancesRoutes,processRoutes,formulationRoutes,ovenRoutes,packagingRoutes,qualityRoutes,dryngLabelRoutes
];

export const routesToExpress: Array<routeInterface> = _.flattenDepth(routes,2).map((route:routeInterface)=>{
    route.controller = init.getController(route.controller.name);
    return route;
});

export const firebaseMiddleware:FirebaseHelper = init.getMiddlewareFirebase();