// import {Request,Response, response} from 'express';
// import { FirebaseHelper } from '../Utils/Firebase.Helper';
// import { Process } from '../Models/Entity/Process';
// import { Product } from '../Models/Entity/Product';
// import { ProductService } from '../Services/Product.Services';
// import { ProcessService } from '../Services/Process.Service';
// import { Grinding } from '../Models/Entity/Grinding';
// import { GrindingService } from '../Services/Grinding.Service';

//export class ProcessController{

//     private productService: ProductService;
//     private processService:ProcessService;
//     private grindingService: GrindingService;

//     constructor(private firebaseInstance:FirebaseHelper){
//         this.processService = new ProcessService();
//         this.productService = new ProductService();
//         this.grindingService = new GrindingService();
//     }

//     async createProcess(req:Request, res:Response){
//         let {new_lote, weight, lote_interno, temperature,hourEntrance,hourExit,
//             dateIni,dateFin,status,current_process,name_elaborated,job_elaborated,name_verify,
//             job_verify,product_id} = req.body;
                
//         let process = new Process();
//         try{
//             console.log("inicio")
//             let product:Product = await this.productService.getProductById(+product_id);
//             console.log(product[0])
//             if(product[0]){
//                 return res.status(404).send({msg:"No existe product"});
//             }else{
//                 process.new_lote = new_lote;
//                 process.weigth = weight;
//                 process.lote_interno = lote_interno;
//                 process.temperature = temperature;
//                 process.entrance_hour = hourEntrance;
//                 process.output_hour = hourExit;
//                 process.start_date = dateIni;
//                 process.end_date = dateFin;
//                 process.status = status;
//                 process.current_process = current_process;
//                 process.name_elaborated = name_elaborated;
//                 process.job_elaborated = job_elaborated;
//                 process.job_verify = job_verify;
//                 process.name_verify = name_verify;
//                 process.product_id = product[0].id;
//             console.log("curso")
//             await this.processService.createProcess(process);
//             console.log("hecho")
//             return res.status(201).send();
//         }
//         }catch(err){
//             console.log(err)
//             return res.status(500).send(err);
//         }
//     }

//     async getAllProcess(req:Request,res:Response){
//         try{
//             let process:Process[] = await this.processService.getProcessActive();
//             let response:any = [];
//             process.forEach((i:any) => {
//                 response.push({
//                 process_id: `${i.id}`,
//                 productName: `${i.description}`,
//                 lot_id: `${i.lote_interno}`,
//                 date: `${i.start_date},${i.end_date}`,
//                 currentProcess: `${i.current_process}`
//                 });
//             });
//         return res.status(200).send(response);
//         }catch(err){
//             return res.status(500).send(err);
//         } 
//     }

//     async getProcessActive(req:Request,res:Response){
//         try{
//             let process:Process[] = await this.processService.getProcessActive();
//             let response:any = [];
//             process.forEach((i:any) => {
//                 response.push({
//                 process_id: `${i.id}`,
//                 productName: `${i.description}`,
//                 lot_id: `${i.lote_interno}`,
//                 date: `${i.start_date},${i.end_date}`,
//                 currentProcess: `${i.current_process}`
//                 });
//             });
//         return res.status(200).send(response);
//         }catch(err){
//             return res.status(500).send(err);
//         } 
//     }

//     async updateProcess(req:Request,res:Response){
//         let {conditioning_id} = req.body;
//         let {id} = req.query;
//         try{
//             let process:Process = await this.processService.getProcessById(+id);
//             if(process){
//                 process.conditioning_id = conditioning_id;
//                 await this.processService.createProcess(process);
//                 return res.status(201).send();
//             }else{
//                 return res.status(404).send({msg:"No existe"});
//             }
//         }catch(err){
//             return res.status(500).send(err);
//         }
//     }

//     async getGrindingByProcessId(req:Request, res: Response){
//         let id = req.params.processId;
//         let process: Process = await this.processService.getProcessWithGrindingById(+id);
//         if(!process)
//             return res.status(409).send({msg:`process with id ${id} wasn't found`});
        
//         if(!process.molienda_id)
//             return res.status(200).send({});
        
//         let response = {
//             rawMaterial: process.molienda_id.raw,
//             process: process.molienda_id.process,
//             weight: process.molienda_id.weight,
//             date: process.molienda_id.date
//         }
//         return res.status(200).send(response);

//     }
// }


import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { ProcessService } from '../Services/Process.Service';

export class ProcessController{

    private processService:ProcessService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
    }

    async saveProcess(req:Request,res:Response){
        await this.processService.saveProcess(req.body);
        return res.status(201).send();
    }

    async updateProcessHourAndDate(req:Request,res:Response){
        await this.processService.updateProcess(req);
        return res.status(204).send();
    }

    async updateStatusProcess(req:Request,res:Response){
        await this.processService.updateStatusProcess(res,req);
        return res.status(204).send();
    }
  
    async getUserProcessVerifier(req: Request, res: Response) {
        let id = req.params.processId;
        if (isNaN(+id) || +id < 1)
            throw Error(`[400], Invalid id path param `);
        let response = await this.processService.getUserProcessVerifier(+id);
        return res.status(200).send(response);
    }

}