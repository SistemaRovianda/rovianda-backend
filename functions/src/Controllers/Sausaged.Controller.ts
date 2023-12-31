import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Product } from '../Models/Entity/Product';
import { ProcessService } from '../Services/Process.Service';
import { SausagedService } from '../Services/Sausaged.Service';
import { ProductService } from '../Services/Product.Services';
import { ProcessRepository } from '../Repositories/Process.Repository';

export class SausagedController{

    private processService:ProcessService;
    private sausagedService:SausagedService
    private productService:ProductService;
    private processRepository: ProcessRepository;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService(this.firebaseInstance);
        this.sausagedService = new SausagedService();
        this.productService = new ProductService();
        this.processRepository = new ProcessRepository();
    }

    async createSausaged(req:Request,res:Response){
        await this.sausagedService.saveSausaged(req.body,+req.params.formulationId);
        return res.status(201).send();
    }

    async getSausagedByProcess(req:Request,res:Response){
        let sausaged = await this.sausagedService.getSausagedByProcess(req);
        return res.status(200).send(sausaged);
    }

    async updateSausageHours(req:Request,res:Response){
        let sausageId:number = +req.params.sausageId;
        return res.status(204).send(await this.sausagedService.updateHours(sausageId,req.body));
    }

    async updateSausaged(req:Request,res:Response){
        await this.sausagedService.updateSausaged(req.body,+req.params.sausageId);
        return res.status(204).send();
    }
}