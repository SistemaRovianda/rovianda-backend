import { ConditioningRepository } from '../Repositories/Conditioning.Repository';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ConditioningDTO } from '../Models/DTO/ConditioningDTO';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { Product } from '../Models/Entity/Product';
import { ProductRepository } from '../Repositories/Product.Repository';


export class ConditioningService{
    private conditioningRepository:ConditioningRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.conditioningRepository = new ConditioningRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
    }
    
    async createConditioningByProcessId(conditioningDTO:ConditioningDTO, processId:string){

    
        if (!conditioningDTO.rawMaterial)  throw new Error("[400],rawMaterial is required");
        if (conditioningDTO.bone == null)  throw new Error("[400],bone is required");
        if (conditioningDTO.clean == null)  throw new Error("[400],clean is required");
        if (conditioningDTO.healthing == null)  throw new Error("[400],healthing is required");
        if (!conditioningDTO.weight)  throw new Error("[400],weight is required");
        if (conditioningDTO.weight<1) throw new Error("[400],el peso no puede ser menor a 1");
        if (!conditioningDTO.temperature)  throw new Error("[400],temperature is required");
        if (isNaN(conditioningDTO.productId) || conditioningDTO.productId < 1)  throw new Error("[400],productId is required");
        if (!conditioningDTO.date)  throw new Error("[400],date is required");

    console.log("inicio");  
    let process: Process = await this.processRepository.findProcessById(+processId);
    if(!process) throw new Error("[400], no existe proceso");
    console.log(process);

    let processConditioning :Process = await this.processRepository.findConditioningByProcessId(+processId);
    
    if(processConditioning.conditioningId == null ) {
        let product: Product = await this.productRepository.getProductById(conditioningDTO.productId);
        if(!product) throw new Error("[400], no existe producto");
            console.log(product);
         
            let conditioning :Conditioning = new Conditioning();
            conditioning.raw = conditioningDTO.rawMaterial;
            conditioning.bone = conditioningDTO.bone;
            conditioning.clean = conditioningDTO.clean;
            conditioning.healthing = conditioningDTO.healthing;
            conditioning.weight = conditioningDTO.weight;
            conditioning.temperature = conditioningDTO.temperature;
            conditioning.productId = product;
            conditioning.date = conditioningDTO.date;
    
            await this.conditioningRepository.createConditioning(conditioning);
    
            let lastConditioning :Conditioning = await this.conditioningRepository.getLastConditioning();
            console.log(lastConditioning);
            process.conditioningId = lastConditioning;
    
            return await this.processRepository.createProcess(process);

    }else
      throw new Error("[400], este proceso ya tiene acondicionamiento asignado");
    }

    async getConditioningById(conditioning_id:number){
        return await this.conditioningRepository.getConditioningById(conditioning_id);
    }

    async getAllConditioning(){
        return await this.conditioningRepository.getAllConditioning();
    }
}