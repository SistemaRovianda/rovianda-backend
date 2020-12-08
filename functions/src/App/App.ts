import  * as express from 'express';
import * as bodyp from 'body-parser';
import * as functions from 'firebase-functions';
import { routesToExpress } from '../Routes/Index';
import { FileRequest, routeInterface } from '../Models/Route.Interface';
import { ErrorHandler } from '../Utils/Error.Handler';
import * as fileMiddleware from 'express-multipart-file-parser';
import { SalesRequestController } from '../Controllers/Sales.Controller';
import { SalesRequestService } from '../Services/Sales.Request.Service';
//const expressF=require("express-formidable");


export class App extends ErrorHandler{
    public app: express.Application;
    //public multer:multer.Multer;
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
                    console.log(err);
                    this.parser(err.message,res);
                }
            })
            
        })
    }

    // mapMulter(items:routeInterface){
    //     console.log(items);
    //     items.files?.forEach(item=>{
    //         if(item.isArray){
    //             this.multer.array(item.name,item.size);
    //         }else{
    //             this.multer.single(item.name);
    //         }  
    //         }) 
    //     }
      
    
}


export const app = functions.https.onRequest( new App().app);

//export const appCron = functions.pubsub.schedule('10 0 * * *')
export const appCron = functions.pubsub.schedule('51 14 * * *')
.timeZone('America/New_York').onRun(async (context)=>{
   console.log("Se programo una cloud function a las 11 10 pm");
    
    let saleService:SalesRequestService = new SalesRequestService(null);
    await saleService.transferAllSalesAutorized();
})