import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { UserService } from '../Services/User.Service';
import { userGeneric } from '../Models/UserGeneric';
import { User } from '../Models/Entity/User';
//import { Users } from '../Models/Entity/User';

export class UserController{

    private processService:ProcessService;
    //private userService:UserService;
    private productService:ProductService
    private usersService:UserService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService();
        this.usersService = new UserService(this.firebaseInstance);
        this.productService = new ProductService();
        
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
        //try{
            console.log("entra");
            console.log(email);
            let getUser = await this.usersService.getByEmail(email);
            console.log("sale");
            if(getUser){
                return res.status(409).send({msg:"usuario ya registrado"});
            }else{
                await this.usersService.createUserF(req.body,userGeneric);
                //await this.nodemailers.sendMailNewAccount(email, { email: email, password });
                return res.status(201).send();
            }
        // }catch(err){
        //     console.log(err);
        //     return res.status(500).send(err);
        // }
    }

    async getUserById(req:Request,res:Response){
        let user = await this.usersService.getUserById(req);
        return res.status(200).send(user);
    }

    async getAllUsers(req:Request,res:Response){
        let users = await this.usersService.getAllUsers();
        return res.status(200).send(users);
    }

    async createToken(req:Request,res:Response){
        await this.usersService.createToken(req.query.uid);
        return res.status(200).send();
    }
}