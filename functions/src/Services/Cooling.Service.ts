import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { Cooling } from '../Models/Entity/Cooling';

export class CoolingService{
    private coolingRepository:CoolingRepository;
    constructor(){
        this.coolingRepository = new CoolingRepository();
    }

    async createCooling(cooling:Cooling){
        return await this.coolingRepository.createCooling(cooling);
    }
    
    async getCoolingById(id:number){
        return await this.coolingRepository.getCoolingById(id);
    }

    
    async getCoollingByStatus(status:string){
        return await this.coolingRepository.getCoollingByStatus(status);
    }
}