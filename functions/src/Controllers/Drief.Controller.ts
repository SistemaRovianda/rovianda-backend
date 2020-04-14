import {Request,Response} from 'express';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
import { ProductService } from '../Services/Product.Services';
import { Product } from '../Models/Entity/Product';
export class DriefController{

    private warehouseDriefService:WarehouseDriefService;
    private productService: ProductService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.warehouseDriefService = new WarehouseDriefService();
        this.productService = new ProductService();
    }

    async createWarehouseDrief(req:Request, res:Response){
        let {user_id, lote_proveedor, date, quantity, observations, 
            opening_date, closing_date, productId, is_pz } = req.body;
        let warehouseDrief = new WarehouseDrief();
        try{
            console.log("entra")
            let product:Product = await this.productService.getProductById(+productId);
            console.log(product[0])
            warehouseDrief.user_id = user_id;
            warehouseDrief.lote_proveedor = lote_proveedor;
            warehouseDrief.date = date;
            warehouseDrief.quantity = quantity;
            warehouseDrief.observations = observations;
            warehouseDrief.status = "OPENED";
            warehouseDrief.opening_date = opening_date;
            warehouseDrief.closing_date = closing_date;
            warehouseDrief.is_pz = is_pz;
            warehouseDrief.product = product[0];
            console.log("realiza")
            await this.warehouseDriefService.createWarehouseDrief(warehouseDrief);
            console.log("realiza")
            return res.status(201).send();
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
}