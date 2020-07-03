// servicio movido a ENTRANCE.DRIEF.CONTROLLER -> PARA MANEJAR SOLO UN CONTROLLER POR CADA SECCION

// import {Request ,Response} from 'express';
// import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
// import { OutputsDrief } from '../Models/Entity/Outputs.Drief';
// import { FirebaseHelper } from '../Utils/Firebase.Helper';
// import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
// import { ProductService } from '../Services/Product.Services';
// import { OutputsDriefService } from '../Services/Outputs.Drief.Service';
// import { Product } from '../Models/Entity/Product';
// export class DriefController{

//     private warehouseDriefService:WarehouseDriefService;
//     private productService: ProductService;
//     private outputsDriefService:OutputsDriefService;
//     constructor(private firebaseInstance:FirebaseHelper){
//         this.warehouseDriefService = new WarehouseDriefService();
//         this.productService = new ProductService();
//         this.outputsDriefService = new OutputsDriefService();
//     }

//     async createWarehouseDrief(req:Request, res:Response){
//         let {user_id, lote_proveedor, date, quantity, observations, 
//             opening_date, closing_date, productId, is_pz } = req.body;
//         let warehouseDrief = new WarehouseDrief();
//         try{
//             console.log("entra")
//             let product:Product = await this.productService.getProductById(+productId);
//             console.log(product[0])
//             warehouseDrief.userId = user_id;
//             warehouseDrief.loteProveedor = lote_proveedor;
//             warehouseDrief.date = date;
//             warehouseDrief.quantity = quantity;
//             warehouseDrief.observations = observations;
//             warehouseDrief.status = "OPENED";
//             warehouseDrief.openingDate = opening_date;
//             warehouseDrief.closingDate = closing_date;
//             warehouseDrief.isPz = is_pz;
//             warehouseDrief.product = product[0];
//             console.log("realiza")
//             await this.warehouseDriefService.createWarehouseDrief(warehouseDrief);
//             console.log("realiza")
//             return res.status(201).send();
//         }catch(err){
//             console.log(err)
//             return res.status(500).send(err);
//         }
//     }

//     async updateWarehouseDrief(req:Request,res:Response){
//         let {id} = req.query;
//         try{
//             let warehouseDrief:WarehouseDrief = await this.warehouseDriefService.getWarehouseDriefRepositoryById(+id);
//             if(warehouseDrief){
//                 if(warehouseDrief.status == "CLOSED"){
//                     return res.status(403).send({msg:"ya esta cerrada"});
//                 }else{
//                     warehouseDrief.status = "CLOSED";
//                     await this.warehouseDriefService.createWarehouseDrief(warehouseDrief);
//                     return res.status(201).send();
//                 }
//             }else{
//                 return res.status(404).send({msg:"No existe"});
//             }
//         }catch(err){
//             return res.status(500).send(err);
//         }
//     }
    

//     // async createOutputsDrief(req:Request,res:Response){
//     //     let {lote_proveedor, productId, observations, date } = req.body;
//     //     let outputsDrief = new OutputsDrief();
//     //     try{
//     //         let product:Product = await this.productService.getProductById(+productId);
//     //         outputsDrief.loteProveedor = lote_proveedor;
//     //         outputsDrief.observations = observations;
//     //         outputsDrief.date = date;
//     //         outputsDrief.product = product[0];
//     //         await this.outputsDriefService.createOutputsDrief(outputsDrief);
//     //         return res.status(201).send();
//     //     }catch(err){
//     //         console.log(err)
//     //         return res.status(500).send(err);
//     //     }
//     // }
// }