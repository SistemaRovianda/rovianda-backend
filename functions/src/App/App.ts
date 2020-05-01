import  * as express from 'express';
import * as bodyp from 'body-parser';
import * as functions from 'firebase-functions';
import { routesToExpress,firebaseMiddleware } from '../Routes/Index';
import { routeInterface } from '../Models/Route.Interface';
import { ErrorHandler } from '../Utils/Error.Handler';
import * as fileMiddleware from 'express-multipart-file-parser';
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
        this.app.use(bodyp.urlencoded({extended:false}));
        this.app.use(bodyp.raw({limit:"10mb"}));
        routesToExpress.map((route:routeInterface)=>{

            (this.app as express.Application)[route.method](route.url,/*firebaseMiddleware.authentication,*/async (req:express.Request,res:express.Response)=>{
                try{
                await (route.controller)[route.target](req,res);
                }catch(err){
                    this.parser(err.message,res);
                }
            })
            
        })
    }
}

export const app = functions.https.onRequest( new App().app);