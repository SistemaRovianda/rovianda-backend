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
            let processToupdate:Process = await this.processService.getProcessById(+processid)
            if(product[0]==undefined){
                return res.status(404).send({msg:"No existe producto"});
            }else{
                console.log(product[0])
                console.log(processToupdate[0]);
                tenderized.product_id = product_id;
                tenderized.weight = weight;
                tenderized.weight_salmuera = weight_salmuera;
                tenderized.temperature = temperature;
                tenderized.product_id = product[0];
                tenderized.date = date;
                console.log("curso")
                processToupdate.tenderized_id=tenderized.id
                await this.processService.createProcess(processToupdate);
                await this.tenderizedService.createTenderized(tenderized);
                console.log("creando")
                return res.status(201).send();
            }
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
}
