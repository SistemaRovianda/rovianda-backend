import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/Error.Handler';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { WarehousePackingService } from '../Services/Warehouse.Packing.Service';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';
import { OutputsPacking } from '../Models/Entity/Outputs.Packing';
import { Product } from '../Models/Entity/Product';
import { ProductService } from '../Services/Product.Services';
import { OutputsPackingService } from '../Services/Outputs.Packing.Service';

export class EntrancesPackingController extends ErrorHandler {

    private warehousepackingService:WarehousePackingService;
    private productService: ProductService;
    private outputsPackingService:OutputsPackingService;

    constructor(private firebaseInstance:FirebaseHelper){
        super();
        this.warehousepackingService = new WarehousePackingService();
        this.productService = new ProductService();
        this.outputsPackingService = new OutputsPackingService();
    }

    async createWarehousePacking(req:Request,res:Response){
       
        let {user_id, productId, date, quantity, is_pz, observations, 
            opening_date, closing_date } = req.body;
        let warehousePacking = new WarehousePacking();
        try{
            let product:Product = await this.productService.getProductById(+productId);
            console.log(product[0])
            warehousePacking.user_id = user_id;
            warehousePacking.date = date;
            warehousePacking.quantity = quantity;
            warehousePacking.observations = observations;
            warehousePacking.status = "OPENED";
            warehousePacking.opening_date = opening_date;
            warehousePacking.closing_date = closing_date;
            warehousePacking.is_pz = is_pz;
            warehousePacking.product_id = product[0];
            await this.warehousepackingService.saveWarehousePacking(warehousePacking);
            return res.status(201).send();
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
        
    async closeWarehousePacking(req:Request,res:Response){
        let {id} = req.body;
        try{
            let warehousePacking:WarehousePacking = await this.warehousepackingService.getWarehousePackingById(+id);
            if(warehousePacking){
                if(warehousePacking.status == "CLOSED"){
                    return res.status(403).send({msg:"YA ESTA CERRADA"});
                }else{
                    warehousePacking.status = "CLOSED";
                    await this.warehousepackingService.saveWarehousePacking(warehousePacking);
                    return res.status(201).send({msg:"CERRADA"});
                }
            }else{
                return res.status(404).send({msg:"No existe"});
            }
        }catch(err){
            return res.status(500).send(err);
        }
    }



}
