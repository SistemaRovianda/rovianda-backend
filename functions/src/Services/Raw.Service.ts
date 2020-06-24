import { RawRepository } from "../Repositories/Raw.Repository";
import { Raw } from "../Models/Entity/Raw";

export class RawService{
    private rawRepository:RawRepository;
    constructor(){
        this.rawRepository = new RawRepository();
    }

    async getRaw(){
        let raw: Raw[] = await this.rawRepository.getAllRaw();
        let response = [];
        raw.forEach(i => {
            response.push({
                rawMaterialId: `${i.id}`,
                rawMaterial: `${i.rawMaterial}`  
            });
        });
        return response;
    }
}