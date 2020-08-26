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

     
 //}


import { Request, Response, response } from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { ProcessService } from '../Services/Process.Service';
import { Process } from '../Models/Entity/Process';
import { ProcessStatus } from '../Models/Enum/ProcessStatus';
import { GrindingService } from '../Services/Grinding.Service';

export class ProcessController {

    private processService: ProcessService;
    private grindingService: GrindingService;

    constructor(private firebaseInstance: FirebaseHelper) {
        this.processService = new ProcessService(this.firebaseInstance);
        this.grindingService = new GrindingService();
    }

    async createProcessInter(req: Request, res: Response) {
        let id = await this.processService.createProcessInter();
        return res.status(201).send({processId: id});
    }
    async createProcess(req: Request, res: Response) {
        await this.processService.createProcess(req.body);
        return res.status(201).send();
    }

    async updateProcessHourAndDate(req: Request, res: Response) {
        await this.processService.updateProcess(req);
        return res.status(204).send();
    }

    async getDefrost(req:Request,res:Response){
        let responde = await this.processService.getDefrost(+req.params.processId);
        return res.status(200).send(responde);
    }

    async updateStatusProcess(req: Request, res: Response) {
        await this.processService.updateStatusProcess(+req.params.processId);
        return res.status(204).send();
    }

    async getUserProcessVerifier(req: Request, res: Response) {
        let id = req.params.processId;
        if (isNaN(+id) || +id < 1)
            throw Error(`[400], Invalid id path param `);
        let response = await this.processService.getUserProcessVerifier(+id);
        return res.status(200).send(response);
    }

    

    async getAllProcess(req: Request, res: Response) {
        let status: string = req.query.status;
        if (status != ProcessStatus.ACTIVE && status != ProcessStatus.INACTIVE) throw new Error("[400], status no valido");
        let process: Process[] = await this.processService.getProcessByStatus(status);
        return res.status(200).send(process);
    }

    async createUserProcess(req: Request, res: Response) {
        await this.processService.createUserProcess(req.body, req.params.processId);
        return res.status(201).send();
    }

    async getGrindingByProcessId(req:Request, res: Response){
        let response = await this.grindingService.getGrindingByProcessId(req);
        return res.status(200).send(response);

    }

    // async getProcess(req:Request, res: Response){

    // }

    // async getProcessActive(req:Request,res:Response){
    //     try{
    //         let process:Process[] = await this.processService.getProcessActive();
    //         let response:any = [];
    //         process.forEach((i:any) => {
    //             response.push({
    //             process_id: `${i.id}`,
    //             productName: `${i.description}`,
    //             lot_id: `${i.lote_interno}`,
    //             date: `${i.start_date},${i.end_date}`,
    //             currentProcess: `${i.current_process}`
    //             });
    //         });
    //     }
    // }

    async getProcessProductsAvailables(req:Request,res:Response){
        let response = await this.processService.getProcessAllAvailables();
        return res.status(200).send(response);
    }

}