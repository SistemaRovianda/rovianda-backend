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
        return await this.outputsDriefRepository.findOne({id},{relations:["product"]})
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

    async getOutputsDriefByLotIdAndStatus(lotsId:any,status:string){
        await this.getConnection();
        return this.outputsDriefRepository.find({
                where: {loteProveedor: `${lotsId}`,status }   
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

    async getOutputsDriefByProductAndStatus(product:Product,status:string){
        await this.getConnection();
        return await this.outputsDriefRepository.find({product,status});
    }

    async getOutputsDriefByIdWithFormulation(id:number){
        await this.getConnection();
        return await this.outputsDriefRepository.findOne({ id},{relations:["formulation"]});
    }

    async updateAllOutputs(lot:string,warehouseDriefId:number){
        await this.getConnection();
        await this.outputsDriefRepository.query(`
            update outputs_drief set lote_proveedor="${lot}" where warehouseDriefId=${warehouseDriefId};
        `);
    }
}