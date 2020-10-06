import { CatCFDIUsesRepository } from "../Repositories/Cat.CFDI.Uses.Repository";
import { CatPaymentTypesRepository } from "../Repositories/Cat.Payment.Types.Repository";

export class CatalogsService{
    private catPaymentTypesRepository: CatPaymentTypesRepository;
    private catCFDIUsesRepository: CatCFDIUsesRepository;

    constructor(){
        this.catCFDIUsesRepository = new CatCFDIUsesRepository();
        this.catPaymentTypesRepository = new CatPaymentTypesRepository();
    }

    async getAllCatCFDIUses(){
        return await this.catCFDIUsesRepository.getAllCFDIUses();
    }

    async getAllPaymentTypes(){
        return await this.catPaymentTypesRepository.getAllPaymentTypes();
    }
}