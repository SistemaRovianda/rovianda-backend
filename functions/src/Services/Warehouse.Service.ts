import { getSqlServerCon } from "../Config/SqlS";
import { WarehouseForm } from "../Models/DTO/Warehouse.DTO";
import { WarehouseEntranceOutputsMetrics } from "../Models/DTO/WarehouseDTO";
import { User } from "../Models/Entity/User";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { SubOrderMetadataRepository } from "../Repositories/SubOrder.Metadata.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { validateWarehouse } from "../Utils/Validators/Warehouse.Validator";


export class WarehouseService{
    private sqlSRepository:SqlSRepository;
    private userRepository:UserRepository;
    private subOrderMetadataRepository:SubOrderMetadataRepository;
    private saleRepository:SaleRepository;
   constructor(){
       this.sqlSRepository = new SqlSRepository();
       this.userRepository = new UserRepository();
       this.subOrderMetadataRepository = new SubOrderMetadataRepository();
       this.saleRepository = new SaleRepository();
   }

    async createWarehouse(warehouseForm:WarehouseForm){
        validateWarehouse(warehouseForm);
        await this.sqlSRepository.createWarehouse(warehouseForm);
    }

    async getAllWarehouse(){
        return await this.sqlSRepository.getAllWarehouses();
    }

    async getEntranceOutputsWarehouse(warehouseSaeId:number,dateStart:string,dateEnd:string){
        let user:User = await this.userRepository.getByWarehouseId(warehouseSaeId.toString());
        let response:WarehouseEntranceOutputsMetrics = {
            entrance:0,
            outputs:0
        }
        if(user){
            let data = await this.subOrderMetadataRepository.getAllEntrancesByProducts(user.id,dateStart,dateEnd);
            if(data.length){
                response.entrance = data[0].weight1Received;
                response.outputs=data[0].weight1Solded;
            }
            return response;
        }else{
            return response;
        }
    }

}