import { MaintenanceRepository } from "../Repositories/Maintenance.Repository";
import { Maintenance } from '../Models/Entity/Maintenance';
import { MaintenanceDTO } from '../Models/DTO/MaintenanceDTO';

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

    async createMaintenance(maintenanceDTO:MaintenanceDTO){

        if (!maintenanceDTO.dateInit)  throw new Error("[400],dateInit is required");
        if (!maintenanceDTO.description)  throw new Error("[400],description is required");
        if (!maintenanceDTO.fullName)  throw new Error("[400],fullName is required");
        if (!maintenanceDTO.typeFailure)  throw new Error("[400],typeFailure is required");


            let maintenance : Maintenance = new Maintenance();
            maintenance.dateInit = maintenanceDTO.dateInit;
            maintenance.description = maintenanceDTO.description;
            maintenance.title = maintenanceDTO.fullName;
            maintenance.descriptionEnd = maintenanceDTO.typeFailure;
            await this.maintenanceRepository.createMaintenance(maintenance);   
    }

    async getMaintenanceMounth(){
    
    let response=  await this.maintenanceRepository.getMaintenanceMounth();
    console.log(response[0].RowDataPacket);
    return response
    }
}