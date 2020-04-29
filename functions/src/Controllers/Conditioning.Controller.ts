import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ProcessService } from '../Services/Process.Service'; 
import { ConditioningService } from '../Services/Conditioning.Service';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { Process } from '../Models/Entity/Process';
import { ErrorHandler } from '../Utils/Error.Handler';

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
            weight, temperature, product_id, date} = req.body;
            if (!rawMaterial) return res.status(400).send({ msg: 'rawMaterial is required'});
            if (!bone) return res.status(400).send({ msg: 'bone is required' });
            if (!clean) return res.status(400).send({ msg: 'clean is required' });
            if (!healthing) return res.status(400).send({ msg: 'healthing is required' });
            if (!weight) return res.status(400).send({ msg: 'weigth is required' });
            if (!temperature) return res.status(400).send({ msg: 'temperature is required' });
            if (!product_id) return res.status(400).send({ msg: 'product_id required' });
            if (!processid) return res.status(400).send({ msg: 'process_id is required' });
            if (!date) return res.status(400).send({ msg: 'date is required' });

        let conditioning = new Conditioning();
        try{
            console.log("inicio")
            let processToUpdate:Process = await this.processService.getProcessById(+processid)
            let product:Product = await this.productService.getProductById(+product_id);
            if(!product[0]){
                throw new Error("[404],product parameters is missing");
                return res.status(404).send({msg:"No existe product"});
            }else{
            console.log(product[0])
            console.log(processToUpdate[0])
            conditioning.raw = rawMaterial;
            conditioning.bone = bone;
            conditioning.clean = clean;
            conditioning.healthing = healthing;
            conditioning.weight = weight;
            conditioning.temperature = temperature;
            conditioning.product_id = product[0].id;
            conditioning.date = date;
            console.log("curso")
            await this.conditionigService.createConditioning(conditioning);
                if(processToUpdate[0]){
                    console.log("actualizando")
                    processToUpdate.conditioning_id=conditioning;
                    await this.processService.createProcess(processToUpdate)
                    return res.status(201).send();
                }else{
                    return res.status(404).send({msg:"No existe"});
                }
            }
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }

    async getConditioning(req:Request,res:Response){

        let processid = req.params.processid
        if (!processid) return res.status(400).send({ msg: 'processid is required' });
        console.log(processid);

        let process:Process = await this.processService.getProcessById(+processid)
        console.log(process[0]);
        if(!process[0]){
            return res.status(400).send({ msg: 'There is no process' });
        }else{
            let conditioning_id = process[0].conditioning_id
            console.log(conditioning_id);
            let conditioning:Conditioning = await this.conditionigService.getConditioningById(+conditioning_id)    
            console.log(conditioning[0]);
            if(!conditioning[0]){
                return res.status(400).send({ msg: 'There is no conditioning related to this process' });
            }else{
                let product_id = conditioning[0].product_id
                let product: Product = await this.productService.getProductById(+product_id)
                console.log(product[0]);
                if(!product[0]){
                    return res.status(400).send({ msg: 'There is no product related to this process.' });
                }else{
                    let response = ({
                        rawMaterial: `${conditioning[0].raw}`,
                        bone: `${conditioning[0].bone}`,
                        clean: `${conditioning[0].clean}`,
                        healthing: `${conditioning[0].healthing}`,
                        weight: `${conditioning[0].weight}`,
                        temperature: `${conditioning[0].temperature}`,
                        product: {
                            id: `${product[0].id}`,
                            description: `${product[0].description}`
                        },
                        date: `${conditioning[0].date}`
                    });
                    return res.status(200).send(response);
                }
                }
            }
    }
}
