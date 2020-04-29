import * as admin from 'firebase-admin';
import credentials from '../Config/Credentials';
import { userGeneric } from '../Models/UserGeneric';
import * as UUID from 'uuid/v4';
import { Request } from 'express';
export class FirebaseHelper{

    constructor(){
        let credential:any = credentials;
        admin.initializeApp({
            credential: admin.credential.cert(credential),
            storageBucket: "gs://rovianda-88249.appspot.com"
        });
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

    async createUser(user:userGeneric){
        console.log("entra log")
        console.log(user)
        return admin.auth().createUser({
            displayName:`${user.name} ${user.firstSurname} ${user.lastSurname}`,
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