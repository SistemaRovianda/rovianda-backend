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
            res.header("Access-Control-Allow-Origin", "*");//"*");
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


export const app = functions.runWith({timeoutSeconds:540}).https.onRequest( new App().app);

// export const appCron = functions.runWith({timeoutSeconds:540}).pubsub.schedule('00 12 * * *')
// .timeZone('America/New_York').onRun(async (context)=>{

//     // console.log("Traspaso iniciado");

    
//     let date = new Date();
//         date.setHours(date.getHours()-24)
//         let salesService:SalesRequestService = new SalesRequestService(null);
//         let month = (date.getMonth()+1).toString();
//         let day = date.getDate().toString();
//         if(+month<10) month="0"+month;
//         if(+day<10) day="0"+day;
//         let dateStr = date.getFullYear()+"-"+month+"-"+day;
//         console.log("Fecha de transferencia: "+dateStr);
//         await salesService.transferAllSalesAutorized(dateStr);
    
// }) 