import { EntrancesMeatRepository } from '../Repositories/Entrances.Meat.Repository';
import { Entrances_Meat } from "../Models/Entity/Entrances.Meat";
import { pdfEntryMeat } from "../Utils/PDF.Entry.Meat"

export class EntrancesMeatService{
    private entrances_meat_Repository:EntrancesMeatRepository;
    constructor(){
        this.entrances_meat_Repository = new EntrancesMeatRepository();
    }


    async saveEntrancesMeat(entrances_meat:Entrances_Meat,res){

        if(!entrances_meat.created_at) throw new Error("[400],Falta la propiedad created_at");
        if(!entrances_meat.lote_interno) throw new Error("[400],Falta la propiedad lote_interno");
        if(!entrances_meat.lote_proveedor) throw new Error("[400],Falta la propiedad lote_proveedor");
        if(!entrances_meat.proveedor) throw new Error("[400],Falta la propiedad proveedor");
        if(!entrances_meat.raw_material) throw new Error("[400],Falta la propiedad raw_material");
        if(!entrances_meat.temperature) throw new Error("[400],Falta la propiedad temperature");
        if(!entrances_meat.texture) throw new Error("[400],Falta la propiedad texture");
        if(!entrances_meat.transport) throw new Error("[400],Falta la propiedad transport");
        if(!entrances_meat.weight) throw new Error("[400],Falta la propiedad weight");
        if(!entrances_meat.strageMaterial) throw new Error("[400],Falta la propiedad strageMaterial");
        if(!entrances_meat.slaughterDate) throw new Error("[400],Falta la propiedad slaughterDate");
        if(!entrances_meat.packing) throw new Error("[400],Falta la propiedad packing");
        if(!entrances_meat.odor) throw new Error("[400],Falta la propiedad odor");
        if(!entrances_meat.job) throw new Error("[400],Falta la propiedad job");
        if(!entrances_meat.fridge) throw new Error("[400],Falta la propiedad fridge");
        if(!entrances_meat.expiration) throw new Error("[400],Falta la propiedad expiration");
        
        let pdf = new pdfEntryMeat();
        pdf.createEntryMeatPDF(entrances_meat);
        
        return await this.entrances_meat_Repository.saveEntrancesMeat(entrances_meat);
    }

}
