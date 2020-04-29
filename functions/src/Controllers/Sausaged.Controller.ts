import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Product } from '../Models/Entity/Product';
import { ProcessService } from '../Services/Process.Service';
import { SausagedService } from '../Services/Sausaged.Service';
import { ProductService } from '../Services/Product.Services';

export class SausagedController{

    private processService:ProcessService;
    private sausagedService:SausagedService
    private productService:ProductService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.sausagedService = new SausagedService();
        this.productService = new ProductService();
    }

    async createSausaged(req:Request,res:Response){
        let {productId,temperature,date} = req.body;
        let {hour1,weightInitial,hour2,weightMedium,hour3,weightFinal} = req.body.time;
        let processId = req.params.processId;
        if (!productId) return res.status(400).send({ msg: 'productId is required'});
        if (!temperature) return res.status(400).send({ msg: 'temperature is required'});
        if (!date) return res.status(400).send({ msg: 'date is required'});
        if (!hour1) return res.status(400).send({ msg: 'hour1 is required'});
        if (!weightInitial) return res.status(400).send({ msg: 'weightInitial is required'});
        if (!hour2) return res.status(400).send({ msg: 'hour2 is required'});
        if (!weightMedium) return res.status(400).send({ msg: 'weightMedium is required'});
        if (!hour3) return res.status(400).send({ msg: 'hour3 is required'});
        if (!weightFinal) return res.status(400).send({ msg: 'weightFinal is required'});
        if (!processId) return res.status(400).send({ msg: 'processId is required'});
        let sausaged = new Sausaged();
        try{
            let processObj:Process = await this.processService.getProcessById(+processId);
            if(processObj){
                let product:Product = await this.productService.getProductById(+productId);
                if(product){
                    sausaged.date = date;
                    sausaged.hour1 = hour1;
                    sausaged.hour2 = hour2;
                    sausaged.hour3 = hour3;
                    sausaged.temperature = temperature;
                    sausaged.weightIni = weightInitial;
                    sausaged.weightMedium = weightMedium;
                    sausaged.weightExit = weightFinal;
                    sausaged.productId = product[0];
                    await this.sausagedService.saveSausaged(sausaged);
                    let objSausaged:Sausaged = await this.sausagedService.getLastSausaged();
                    processObj.sausageId = objSausaged[0];
                    await this.processService.createProcess(processObj);
                    return res.status(201).send();
                }else{
                    return res.status(404).send({msg: "Product not found"});
                }
            }else{
                return res.status(404).send({msg: "Process not found"});
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }

    async getSausagedByProcess(req:Request,res:Response){
        let processId = req.params.processId;
        try{
            if (!processId) return res.status(400).send({ msg: 'processId is required'});
            let process:Process = await this.processService.getProcessById(+processId);
            if(process){
                let sausaged:Sausaged[] = await this.sausagedService.getSausagedByProcess(+processId);
                let response:any = [];
                sausaged.forEach((i:any) => {
                    response.push({
                        sausagedId: `${i.id}`,
                        productId: `${i.productIdId}`,
                        temperature: `${i.temperature}`,
                        date: `${i.date}`,
                        time: {
                            hour1: `${i.hour1}`,
                            weightInitial: `${i.weight_ini}`,
                            hour2: `${i.hour2}`,
                            weightMedium: `${i.weight_medium}`,
                            hour3: `${i.hour3}`,
                            weightFinal: `${i.weight_exit}`
                        }
                    });
                });
                return res.status(200).send(response);
            }else{
                return res.status(404).send({msg: "Process not found"});
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }
}