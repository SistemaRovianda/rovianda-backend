import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Tenderized } from '../Models/Entity/Tenderized';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { TenderizedService } from '../Services/Tenderized.Service';
import { ProcessService } from '../Services/Process.Service';
import { Process } from '../Models/Entity/Process';
export class TenderizedController{

    private tenderizedService: TenderizedService;
    private productService: ProductService;
    private processService:ProcessService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.tenderizedService = new TenderizedService();
        this.productService = new ProductService();
        this.processService = new ProcessService();
    }

    async createTenderized(req:Request, res:Response){
        let processid = req.params.processid
        console.log(processid);

        let {product_id,temperature,weight,weight_salmuera,percentage,date} = req.body;

            if (!product_id) return res.status(400).send({ msg: 'product_id is required'});
            if (!temperature) return res.status(400).send({ msg: 'temperature is required' });
            if (!weight) return res.status(400).send({ msg: 'weight is required' });
            if (!weight_salmuera) return res.status(400).send({ msg: 'weight_salmuera is required' });
            if (!percentage) return res.status(400).send({ msg: 'percentage is required' });
            if (!date) return res.status(400).send({ msg: 'date is required' });

        let tenderized = new Tenderized();
        
        try{
            console.log("inicio")
            let product:Product = await this.productService.getProductById(+product_id);
            let processToUpdate:Process = await this.processService.getProcessById(+processid)
            if(!product[0]){
                return res.status(404).send({msg:"No existe product"});
            }else{
                console.log(product[0]);
                console.log(processToUpdate[0]);
                tenderized.weight = weight;
                tenderized.weight_salmuera = weight_salmuera;
                tenderized.temperature = temperature;
                tenderized.product_id = product[0].id;
                tenderized.date = date;
                tenderized.percent_inject = percentage;
                console.log("curso")
                await this.tenderizedService.createTenderized(tenderized);
                if(processToUpdate[0]){
                    console.log("actualizando")
                    processToUpdate.tenderized_id=tenderized;
                    await this.processService.createProcess(processToUpdate)
                    return res.status(201).send();
                }else{
                    return res.status(404).send({msg:"No existe process"});
                }
            }
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }

    async getTenderized(req:Request,res:Response){

       let processid = req.params.processid
        if (!processid) return res.status(400).send({ msg: 'processid is required' });
        console.log(processid);

        let process:Process = await this.processService.getProcessById(+processid)
        console.log(process[0]);
        if(!process){
            return res.status(400).send({ msg: 'There is no process' });
        }else{
            let tenderized_id = process[0].tenderized_id
            if (!tenderized_id) return res.status(400).send({ msg: 'There is no tenderized' });
            console.log(tenderized_id);
            let tenderized:Tenderized = await this.tenderizedService.getTenderizedById(+tenderized_id)    
            console.log(tenderized[0]);
            if(!tenderized){
                return res.status(400).send({ msg: 'There is no tenderized related to this process' });
            }else{
                let product_id = tenderized[0].product_id
                if (!product_id) return res.status(400).send({ msg: 'There is no product' });
                let product: Product = await this.productService.getProductById(+product_id)
                console.log(product[0]);
                if(!product){
                    return res.status(400).send({ msg: 'There is no product related to this process.' });
                }else{
                    let response = ({
                        temperature: `${tenderized[0].temperature}`,
                        weight: `${tenderized[0].weight}`,
                        weight_salmuera: `${tenderized[0].weight_salmuera}`,
                        percentage: `${tenderized.percent_inject}`,
                        date: `${tenderized.date}`,
                        product: {
                            id: `${product[0].id}`,
                            description: `${product[0].description}`
                        }
                    });
                    return res.status(200).send(response);
                }
            }
        }
    }

}
