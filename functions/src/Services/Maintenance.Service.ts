import { MaintenanceRepository } from "../Repositories/Maintenance.Repository";
import { Maintenance } from "../Models/Entity/Maintenance";

export class MaintenanceService{
    private maintenanceRepository:MaintenanceRepository;
    constructor(){
        this.maintenanceRepository = new MaintenanceRepository();
    }

    async getAllMaintenance(){
        let maintenance:Maintenance[] = await this.maintenanceRepository.getAllMaintenance();
        let response = [];
        maintenance.forEach(i => {
            response.push({
                titleFailure: `${i.title}`,
                date: `${i.dateInit}`,
                image: `${i.picture}`,
                description: `${i.description}`
              }  
            );
        });
        return response;
    }
    
}