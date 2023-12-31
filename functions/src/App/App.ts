﻿import  * as express from 'express';
import * as bodyp from 'body-parser';
import * as functions from 'firebase-functions';
import { routesToExpress } from '../Routes/Index';
import { routeInterface } from '../Models/Route.Interface';
import { ErrorHandler } from '../Utils/Error.Handler';
import * as fileMiddleware from 'express-multipart-file-parser';
import { SalesRequestService } from '../Services/Sales.Request.Service';
import { OrderAutomaticCreationService } from '../Services/OrderAutomaticCreation.Service';

export class App extends ErrorHandler{
    public app: express.Application;
    
    constructor(){
        super();
        this.app = express();
        this.config();
    }
    config(){
        this.app.use(fileMiddleware);
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, responseType, X-Total-Count");
            res.header('Access-Control-Allow-Methods', "*");
            next();
      });
        this.app.options('*', (req, res) => {
            // allowed XHR methods  
            res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
            res.send();
        });
        this.app.use(bodyp.json({limit:"10mb"}));
        this.app.use(bodyp.urlencoded({extended:true}));
        this.app.use(bodyp.raw({limit:"10mb"}));
        routesToExpress.map((route:routeInterface)=>{
            
            (this.app as express.Application)[route.method](route.url,async (req:express.Request,res:express.Response,next)=>{
                try{
                //this.mapMulter(route,req,res,next);
                await (route.controller)[route.target](req,res);
                }catch(err){
                    console.log(err,route.target);
                    this.parser(err.message,res);
                }
            })
            
        })
    }
    
}


export const app = functions.runWith({timeoutSeconds:540}).https.onRequest( new App().app);

export const checkSalesCredit = functions.pubsub.schedule('0 * * * *').timeZone("America/Mexico_City").onRun(async (context)=>{
    let service:SalesRequestService = new SalesRequestService(null);
    await service.validateCreditSalePaymentToUpdate();
    return null;
})

export const checkPreSalesForOrders = functions.pubsub.schedule('0 23 * * *').timeZone("America/Mexico_City").onRun(async (context)=>{
    let service:OrderAutomaticCreationService = new OrderAutomaticCreationService();
    await service.checkForOrders();
    return null;
})