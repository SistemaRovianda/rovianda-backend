import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { User } from '../Models/Entity/Users';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { UserService } from '../Services/User.Service';
import { UsersService } from '../Services/Users.Service';
import { userGeneric } from '../Models/UserGeneric';
//import { Users } from '../Models/Entity/User';

export class UserController{

    private processService:ProcessService;
    private userService:UserService;
    private productService:ProductService
    private usersService:UsersService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.userService = new UserService();
        this.productService = new ProductService();
        this.usersService = new UsersService(this.firebaseInstance);
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
                        processToUpdate.nameElaborated = nameElaborated;
                        processToUpdate.nameVerify = nameVerify;
                        processToUpdate.jobElaborated = jobElaborated;
                        processToUpdate.jobVerify = jobVerify;
                        processToUpdate.userId = user[0];
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

    async createUserF(req:Request, res:Response){
        let {name,firstName,lastName,email,password,rol} = req.body;
        let userGeneric: userGeneric={
            email,
            firstName,
            lastName,
            name,
            password
        }
        try{
            console.log("entra");
            console.log(email);
            let getUser = await this.usersService.getUserByEmail(email);
            console.log("sale");
            if(getUser[0]){
                return res.status(409).send({msg:"usuario ya registrado"});
            }else{
                await this.usersService.createUser(req.body,userGeneric);
                return res.status(201).send();
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }

    async getUserById(req:Request,res:Response){
        let user = await this.usersService.getUserById(req);
        return res.status(200).send(user);
    }
}