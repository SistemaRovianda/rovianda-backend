import { routeInterface } from "../Models/Route.Interface";
import { userRoutes } from './User.Routes';
import { Initializer } from '../Config/Initializer';
import  {categoryRoutes} from './Category.Routes';
import { productRoutes } from './Product.Routes';
import * as _ from 'lodash';
import { productSaleRoutes } from "./ProductSale.Routes";
import { condimentRoutes } from "./Condiment.Routes";
import { qualifyBussinessRoutes } from "./QualifyBussiness.Routes";
import { questionRoutes } from "./Question.Routes";
import { orderRoutes } from "./Order.Routes";
import { extraRoutes } from "./Extra.Routes";
const init:Initializer = new Initializer();
const routes:Array<Array<routeInterface>>=[
    userRoutes,categoryRoutes,productRoutes,productSaleRoutes,condimentRoutes,qualifyBussinessRoutes,
    questionRoutes,orderRoutes,extraRoutes
];

export const routesToExpress: Array<routeInterface> = _.flattenDepth(routes,2).map((route:routeInterface)=>{
    route.controller = init.getController(route.controller.name);
    return route;
});