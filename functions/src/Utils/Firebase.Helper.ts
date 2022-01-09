import * as admin from 'firebase-admin';
import credentials from '../Config/Credentials';
import { userGeneric } from '../Models/UserGeneric';
import * as UUID from 'uuid/v4';
import { Request } from 'express';
import { UserRepository } from '../Repositories/User.Repository';
import { User } from '../Models/Entity/User';
export class FirebaseHelper{
    private userRepository:UserRepository;
    constructor(){
        this.userRepository= new UserRepository();
        let credential:any = credentials;
        admin.initializeApp({
            credential: admin.credential.cert(credential),
            //storageBucket: "gs://rovianda-88249.appspot.com"
            storageBucket: "gs://sistema-rovianda.appspot.com"
        });
    }

    async createToken(uid){
        try{
            let token = await admin.auth().createCustomToken(uid);
            console.log(token);
            return token;
        }catch(err){
            console.log(err);
            return err;
        }
    }

    async authentication(req:Request){
        try{
            let tokenDecoded=await admin.auth().verifyIdToken(req.headers.authorization);
            req.headers.uid = tokenDecoded.uid;
            return req;
        }catch(err){
            console.log(err);
            return req;
        }
    }

    // async updateUsers(){
        
    //     let usersList:admin.auth.ListUsersResult = await admin.auth().listUsers(1000);
    //     for(let user of usersList.users){
    //         let userEntity = await this.userRepository.getUserById(user.uid);
    //         if(userEntity){
    //             userEntity.createdAt = new Date(user.metadata.creationTime).toISOString();
    //             await this.userRepository.saveUser(userEntity);
    //         }
    //     }
    // }

    async notificateToAdminSales(){
        //let adminTokens = await this.userRepository.getAllAdminSales();
        let message:admin.messaging.Message={
            topic:"admin_sales",
            notification:{
                title:`Sistema Rovianda`,
                body: `Hay solicitudes por atender`
            }
        };
        await admin.messaging().send(message);
    }
    // async notificateToSeller(sellerId:string,status:string){
    //     let user:User = await this.userRepository.getUserById(sellerId);
    //     if(user.token){
    //         let message:admin.messaging.Message={
    //             token:user.token,
    //             notification:{
    //                 title:`Se a ${status} tu solicitud de cancelación`,
    //                 body: `Revisa tu cierre`
    //             }
    //         };
    //         await admin.messaging().send(message);
    //     }   
    // }

    async createUser(user:userGeneric){
        console.log("entra log")
        console.log(user)
        return admin.auth().createUser({
            displayName:`${user.name}`,
            email: user.email,
            password: user.password,
            emailVerified: false
        });
    }

    async deleteUser(userId:string){
        return admin.auth().deleteUser(userId);
    }

    async uploadImage(basePath:string,file:Buffer){
        
        let storage = admin.storage();
        let filename:string = UUID();
        console.log("FILENAME:",filename);
        return await storage.bucket().file(`${basePath+filename}.jpg`).save(file,{
            metadata:{
                contentType: "image/jpeg",
                metadata: {
                    custom: "metadata"
                }
            },
            public:true,
            validation: "md5"
        }).then(async()=>{
            return await storage.bucket().file(`${basePath+filename}.jpg`).getSignedUrl({action:"read",expires:"12-12-2030"}).then(async(url)=>{
                return url[0].slice(0,url[0].indexOf("?"));
            }).catch((err)=>{
                console.log("OCURRIO UN ERROR OBTENIENO LA URL",err);
                return "";
            })
        }).catch((err)=>{
            console.log("OCURRION UN ERROR AL SUBIR EL ARCHIVO",err);
            return "";
        })
        
    }

    async deleteImagen(fileurl:string){
        let storage = admin.storage();
        
        return await storage.bucket().file(fileurl).delete();
    }

}