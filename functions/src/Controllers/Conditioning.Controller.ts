import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ProcessService } from '../Services/Process.Service'; 
import { ConditioningService } from '../Services/Conditioning.Service';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { Process } from '../Models/Entity/Process';
import { ErrorHandler } from '../Utils/Error.Handler';
import { ProcessRepository } from '../Repositories/Process.Repository';

export class ConditioningController{

    private conditionigService: ConditioningService;
    private processService:ProcessService;
    private productService: ProductService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.conditionigService = new ConditioningService();
        this.productService = new ProductService();
    }

    async createConditioningByProcessId(req:Request, res:Response){
        await this.conditionigService.createConditioningByProcessId(req.body,req.params.processId);
        return res.status(201).send();
    }

    async getConditioning(req:Request, res:Response){
        let conditioning = await this.conditionigService.getConditioning(req.params.processId);
        return res.status(200).send(conditioning);
    }

/*         async getConditioning(req:Request,res:Response){

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
 */
}