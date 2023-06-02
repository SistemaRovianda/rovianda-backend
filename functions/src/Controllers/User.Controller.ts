import {request, Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { UserService } from '../Services/User.Service';
import { userGeneric } from '../Models/UserGeneric';
import { User } from '../Models/Entity/User';
import { SimpleUserUpdateRequest, UserPreSaleRegisterRequest, UserPreSaleUpdateRequest, UserRegisterRequest, UserSellerRegisterRequest, UserSellerUpdateRequest } from '../Models/DTO/UserDTO';
//import { Users } from '../Models/Entity/User';

export class UserController{

    private processService:ProcessService;
    //private userService:UserService;
    private productService:ProductService
    private usersService:UserService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.processService = new ProcessService(this.firebaseInstance);
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
        let token = await this.usersService.createToken(req.query.uid);
        return res.status(200).send({toke:token});
    }

    async getUserByRol(req:Request,res:Response){
        let users = await this.usersService.getUserByRol(req.params.rol);
        return res.status(200).send(users);
    }

    async updateUserStatus(req:Request,res:Response){
        let {userId,status,name} =req.body;
        await this.usersService.updateUserStatus(userId,status,name);
        return res.status(204).send();
    }
    async updateUserPassword(req:Request,res:Response){
        await this.usersService.updateUserPassword(req.body);
        return res.status(204).send();
    }

    async userRegister(req:Request,res:Response){
        let request:UserRegisterRequest = req.body;
        await this.usersService.createSimpleUser(request);
        return res.status(201).send();
    }
    async simpleUserDetails(req:Request,res:Response){
        let uid:string=  req.params.uid as string;
        let response = await this.usersService.getSimpleUserDetails(uid);
        return res.status(200).send(response);
    }

    async userRegisterSeller(req:Request,res:Response){
        let request:UserSellerRegisterRequest = req.body;
        await this.usersService.createSellerUser(request);
        return res.status(201).send();
    }
    async sellerUserDetails(req:Request,res:Response){
        let uid:string=  req.params.uid as string;
        let response = await this.usersService.getSellerUserDetails(uid);
        return res.status(200).send(response);
    }

    async createPreSaleUser(req:Request,res:Response){
        let request:UserPreSaleRegisterRequest = req.body;
        await this.usersService.createPreSaleUser(request);
        return res.status(201).send();
    }
    async preSaleUserDetails(req:Request,res:Response){
        let uid:string=  req.params.uid as string;
        let response = await this.usersService.getPreSaleUserDetails(uid);
        return res.status(200).send(response);
    }

    async simpleUserUpdate(req:Request,res:Response){
        let uid:string = req.params.uid as string;
        let request:SimpleUserUpdateRequest = req.body;
        await this.usersService.updateSimpleUser(uid,request);
        return res.status(204).send();
    }

    async sellerUserUpdate(req:Request,res:Response){
        let uid:string = req.params.uid as string;
        let request:UserSellerUpdateRequest = req.body;
        await this.usersService.updateSellerUser(uid,request);
        return res.status(204).send();
    }   
    async preSaleUserUpdate(req:Request,res:Response){
        let uid:string = req.params.uid as string;
        let request:UserPreSaleUpdateRequest = req.body;
        await this.usersService.updatePreSaleUser(uid,request);
        return res.status(204).send();
    }
}