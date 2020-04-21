import {Request,Response} from 'express';
import { Fridges } from '../Models/Entity/Fridges';
import { Cooling } from '../Models/Entity/Cooling';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { FridgesService } from '../Services/Fridges.Service';
import { CoolingService } from '../Services/Cooling.Service';
export class InquietudController{

    private coolingService:CoolingService;
    private fridgesService: FridgesService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.coolingService = new CoolingService();
        this.fridgesService = new FridgesService();
    }

    async createCooling(req:Request,res:Response){
        let {lote_interno, lote_proveedor, quantity, userid, 
            status, raw_material, opening_date, closing_date, fridgeId} = req.body;
        if (!lote_interno) return res.status(400).send({ msg: 'lote_interno is required' });
        if (!lote_proveedor) return res.status(400).send({ msg: 'lote_proveedor is required' });
        if (!quantity) return res.status(400).send({ msg: 'quantity is required' });
        if (!raw_material) return res.status(400).send({ msg: 'raw_material is required' });
        if (!opening_date) return res.status(400).send({ msg: 'opening_date is required' });
        if (!fridgeId) return res.status(400).send({ msg: 'fridgeId is required' });
        if (!userid) return res.status(400).send({ msg: 'userid is required' });

        let cooling = new Cooling();
        try{
            let fridges:Fridges = await this.fridgesService.getFridgesById(+fridgeId);
            cooling.lote_interno = lote_proveedor;
            cooling.lote_proveedor = lote_proveedor;
            cooling.quantity = quantity;
            cooling.userid = userid;
            cooling.status = "OPENED";
            cooling.raw_material = raw_material;
            cooling.opening_date = opening_date;
            cooling.closing_date = closing_date;
            cooling.fridge = fridges[0];
            await this.coolingService.createCooling(cooling);
            return res.status(201).send();
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }

    async closedCooling(req:Request,res:Response){
        let {lote_interno, lote_proveedor, quantity, userid, 
            status, raw_material, opening_date, closing_date, fridgeId} = req.body;
        let {id} = req.query;
        if (!lote_interno) return res.status(400).send({ msg: 'lote_interno is required' });
        if (!lote_proveedor) return res.status(400).send({ msg: 'lote_proveedor is required' });
        if (!quantity) return res.status(400).send({ msg: 'quantity is required' });
        if (!raw_material) return res.status(400).send({ msg: 'raw_material is required' });
        if (!opening_date) return res.status(400).send({ msg: 'opening_date is required' });
        if (!fridgeId) return res.status(400).send({ msg: 'fridgeId is required' });
        if (!userid) return res.status(400).send({ msg: 'userid is required' });
        if (!id) return res.status(400).send({ msg: 'id is required' });
        try{
            let cooling:Cooling = await this.coolingService.getCoolingById(+id);
            if(cooling){
                if(cooling.status == "CLOSED"){
                    return res.status(403).send({msg:"ya esta cerrada"});
                }else{
                    let fridges:Fridges = await this.fridgesService.getFridgesById(+fridgeId);
                    cooling.lote_interno = lote_proveedor;
                    cooling.lote_proveedor = lote_proveedor;
                    cooling.quantity = quantity;
                    cooling.userid = userid;
                    cooling.status = "CLOSED";
                    cooling.raw_material = raw_material;
                    cooling.opening_date = opening_date;
                    cooling.closing_date = closing_date;
                    cooling.fridge = fridges[0];
                    await this.coolingService.createCooling(cooling);
                    return res.status(201).send();
                }
            }else{
                return res.status(404).send({msg:"No existe"});
            }
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
}