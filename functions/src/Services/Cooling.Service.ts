import { CoolingRepository } from "../Repositories/Cooling.Repository";

export class CoolingService{
    private coolingRepository:CoolingRepository;
    constructor(){
        this.coolingRepository = new CoolingRepository();
    }
    
    async getCoolingById(id:number){
        return await this.coolingRepository.getCoolingById(id);
    }

    
    async getCoollingByStatus(status:string){
        return await this.coolingRepository.getCoollingByStatus(status);
    }
}