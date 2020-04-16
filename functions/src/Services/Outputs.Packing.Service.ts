import { OutputsPackingRepository } from "../Repositories/Outputs.Packing.Repository";
import { OutputsPacking } from '../Models/Entity/Outputs.Packing';

export class OutputsPackingService{
    private outputsPackingRepository:OutputsPackingRepository;
    constructor(){
        this.outputsPackingRepository = new OutputsPackingRepository();
    }

    async getAlloutputsPacking(){
        return await this.outputsPackingRepository.getAllOutputsPacking();
    }

    async getOutputsPackingById(id:number){
        return await this.outputsPackingRepository.getOutputsPackingById(id);
    }

    async getOutputsPackingByLot(lot:string){
        return await this.outputsPackingRepository.getOutputsPackingByLot(lot);
    }
    
}