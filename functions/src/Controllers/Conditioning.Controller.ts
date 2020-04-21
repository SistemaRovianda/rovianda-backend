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
            if (!rawMaterial) return res.status(400).send({ msg: 'rawMaterial is required'});
            if (!bone) return res.status(400).send({ msg: 'bone is required' });
            if (!clean) return res.status(400).send({ msg: 'clean is required' });
            if (!healthing) return res.status(400).send({ msg: 'healthing is required' });
            if (!weigth) return res.status(400).send({ msg: 'weigth is required' });
            if (!temperature) return res.status(400).send({ msg: 'temperature is required' });
            if (!product_id) return res.status(400).send({ msg: 'product_id required' });
            if (!processid) return res.status(400).send({ msg: 'process_id is required' });
            if (!date) return res.status(400).send({ msg: 'date is required' });

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
            if(processToupdate[0]){
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
    async getProductConditioning(req:Request,res:Response){

        let processid = req.params.processid
        if (!processid) return res.status(400).send({ msg: 'processid is required' });
        console.log(processid);

        let productConditioning:Conditioning[] = await this.conditionigService.getProductConditioning(+processid);
        
        let response:any = [];
        
        productConditioning.forEach((i:any) => {
            response.push({
                rawMaterial: `${i.raw}`,
                bone: `${i.bone}`,
                clean: `${i.clean}`,
                healthing: `${i.healting}`,
                weight: `${i.weight}`,
                temperature: `${i.temperature}`,
                product: {
                    id: `${i.product_id}`,
                    description: `${i.description}`
                },
                date: `${i.date}`
            });
        });
        return res.status(200).send(response);
    }
}