import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { User } from '../Models/Entity/Users';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { UserService } from '../Services/User.Service';

export class UserController{

    private processService:ProcessService;
    private userService:UserService;
    private productService:ProductService

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.userService = new UserService();
        this.productService = new ProductService();
    }

    async createUserProcess(req:Request,res:Response){

        let {nameElaborated,jobElaborated,nameVerify,jobVerify} = req.body;
        let processId = req.params.processId;
        if (!nameElaborated) return res.status(400).send({ msg: 'nameElaborated is required'});
        if (!jobElaborated) return res.status(400).send({ msg: 'jobElaborated is required'});
        if (!nameVerify) return res.status(400).send({ msg: 'nameVerify is required'});
        if (!jobVerify) return res.status(400).send({ msg: 'jobVerify is required'});
        if (!processId) return res.status(400).send({ msg: 'processId is required'});

        try{
            let user:User = await this.userService.getUserByName(nameElaborated);
            if(user){
                let processToUpdate:Process = await this.processService.getProcessById(+processId);
                if(processToUpdate){
                    let product_id = processToUpdate[0].id;
                    let product:Product = await this.productService.getProductById(+product_id);
                    if(product){
                        processToUpdate.name_elaborated = nameElaborated;
                        processToUpdate.name_verify = nameVerify;
                        processToUpdate.job_elaborated = jobElaborated;
                        processToUpdate.job_verify = jobVerify;
                        processToUpdate.user_id = user[0];
                        await this.processService.createProcess(processToUpdate);
                        return res.status(201).send();
                    }else{
                        return res.status(404).send({msg:  'There is no product related to this process.'});
                    }
                }else{
                    return res.status(404).send({msg: "Process not found"});
                }
            }else{
                return res.status(400).send({ msg: 'User not found'});
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }
}