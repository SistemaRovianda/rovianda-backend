import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { ProcessService } from '../Services/Process.Service';

export class ProcessController{

    private productService: ProductService;
    private processService:ProcessService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.productService = new ProductService();
    }

    async createProcess(req:Request, res:Response){
        let {product_id, new_lote, weight, lote_interno, temperature,hourEntrance,hourExit,
            dateIni,dateFin,status,current_process,name_elaborated,job_elaborated,name_verify,
            job_verify} = req.body;
                
        let process = new Process();
        try{
            console.log("inicio")
            let product:Product = await this.productService.getProductById(+product_id);
            console.log(product[0])
            process.product_id = product_id;
            process.new_lote = new_lote;
            process.weigth = weight;
            process.lote_interno = lote_interno;
            process.temperature = temperature;
            process.entrance_hour = hourEntrance;
            process.output_hour = hourExit;
            process.start_date = dateIni;
            process.end_date = dateFin;
            process.status = status;
            process.current_process = current_process;
            process.name_elaborated = name_elaborated;
            process.job_elaborated = job_elaborated;
            process.job_verify = job_verify;
            process.name_verify = name_verify;
            process.product_id = product[0];
            console.log("curso")
            await this.processService.createProcess(process);
            console.log("hecho")
            return res.status(201).send();
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
}