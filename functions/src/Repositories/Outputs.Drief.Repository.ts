import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OutputsDrief } from '../Models/Entity/Outputs.Drief';
import { Product } from '../Models/Entity/Product';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
export class OutputsDriefRepository{
    private outputsDriefRepository:Repository<OutputsDrief>;

    async getConnection(){
        if(!this.outputsDriefRepository){
            this.outputsDriefRepository = (await connect()).getRepository(OutputsDrief);
        }
    }

    async createOutputsDrief(outputsDrief:OutputsDrief){
        await this.getConnection();
        return await this.outputsDriefRepository.save(outputsDrief);
    }

    async getAllOutputsDrief(){
        await this.getConnection();
        return await this.outputsDriefRepository.find(
            { relations: ["product"] }
        );
    }

    async getOutputsDriefById(id:number){
        await this.getConnection();
        return await this.outputsDriefRepository.findOne({id})
    }

    async getOutputsDriefByLot(lot:string){
        await this.getConnection();
        return await this.outputsDriefRepository.findOne({
            where: {lote_proveedor: `${lot}`},
            relations: ["warehouseDrief"]
        });
    }

    async getOutputsDriefByLotId( lotsId:any){
        await this.getConnection();
        return this.outputsDriefRepository.find({
                where: {loteProveedor: `${lotsId}` }   
            });
    }

    async getOutputsDriefByProduct(product:Product){
        await this.getConnection();

        return this.outputsDriefRepository.find({product});
    }

    async getOutputsDriefByWarehouseDrief(warehouseDrief:WarehouseDrief){
        await this.getConnection();
        return this.outputsDriefRepository.find({warehouseDrief})
    }
}