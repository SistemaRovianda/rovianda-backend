import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ProcessService } from '../Services/Process.Service'; 
import { ConditioningService } from '../Services/Conditioning.Service';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { Process } from '../Models/Entity/Process';

export class ConditioningController{

    private conditionigService: ConditioningService;
    private processService:ProcessService;
    private productService: ProductService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.conditionigService = new ConditioningService();
        this.productService = new ProductService();
    }

    async createConditioning(req:Request, res:Response){
    
        let processid = req.params.processid
        
        console.log(processid);

        let {rawMaterial, bone, clean,healthing,
            weigth, temperature, product_id, date} = req.body;

        let conditioning = new Conditioning();
        
        try{
            console.log("inicio")
            let processToupdate:Process = await this.processService.getProcessById(+processid)
            let product:Product = await this.productService.getProductById(+product_id);
            console.log(product[0])
            conditioning.raw = rawMaterial;
            conditioning.bone = bone;
            conditioning.clean = clean;
            conditioning.healthing = healthing;
            conditioning.weight = weigth;
            conditioning.temperature = temperature;
            conditioning.product_id = product[0];
            conditioning.date = date;
            console.log("curso")
            await this.conditionigService.createConditioning(conditioning);
            if(processToupdate){
                console.log("actualizando")
                processToupdate.conditioning_id=conditioning.id;
                await this.processService.createProcess(processToupdate)
                return res.status(201).send();
            }else{
                return res.status(404).send({msg:"No existe"});
            }
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }

}