import { PinRepository } from "../Repositories/Pin.Repository";
import { Pin } from "../Models/Entity/Pin";

export class PinService{
    private pinRepository:PinRepository;
    constructor(){
        this.pinRepository = new PinRepository();
    }

    async getAllPins(){
        return await this.pinRepository.getAllPins();
    }
}