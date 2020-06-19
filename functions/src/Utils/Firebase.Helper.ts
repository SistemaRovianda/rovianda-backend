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

    async createToken(uid){
        // //let uid = 'some-uid';
        // let token:string =""
        // admin.auth().createCustomToken(uid)
        //   .then(function(customToken) {
        //     console.log(customToken)
        //     token = customToken;
        //   })
        //   .catch(function(error) {
        //     console.log('Error creating custom token:', error);
        //   });
        //   console.log("pasa")
        //   console.log(token)
        //   return token;
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
    // async authentication(req:Request){
    //     admin.auth().verifyIdToken(req.headers.authorization)
    //       .then(function(decodedToken) {
    //         let uid = decodedToken.uid;
    //         return req;
    //       }).catch(function(error) {
    //         // Handle error
    //       });
    // }

    // async createToken(uid){
    //     //let uid = 'some-uid';
    //     let token:string =""
    //     admin.auth().createCustomToken(uid)
    //       .then(function(customToken) {
    //         console.log(customToken)
    //         token = customToken;
    //       })
    //       .catch(function(error) {
    //         console.log('Error creating custom token:', error);
    //       });
    //       console.log("pasa")
    //       console.log(token)
    //       return token;
    // }

    async createUser(user:userGeneric){
        console.log("entra log")
        console.log(user)
        return admin.auth().createUser({
            displayName:`${user.name} ${user.firstName} ${user.lastName}`,
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