import { ConditioningRepository } from '../Repositories/Conditioning.Repository';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ConditioningDTO } from '../Models/DTO/ConditioningDTO';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { Product } from '../Models/Entity/Product';
import { ProductRepository } from '../Repositories/Product.Repository';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';


export class ConditioningService{
    private conditioningRepository:ConditioningRepository;
    private processRepository:ProcessRepository;
    private productRepository:ProductRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    constructor(){
        this.conditioningRepository = new ConditioningRepository();
        this.processRepository = new ProcessRepository();
        this.productRepository = new ProductRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        
    }
    
    async createConditioningByProcessId(conditioningDTO:ConditioningDTO, processId:string){
        console.log(processId);
        if(!processId)throw new Error("[400], processId in path is required");
        if (!conditioningDTO.rawMaterial)  throw new Error("[400],rawMaterial is required");
        if (conditioningDTO.bone == null)  throw new Error("[400],bone is required");
        if (conditioningDTO.clean == null)  throw new Error("[400],clean is required");
        if (conditioningDTO.healthing == null)  throw new Error("[400],healthing is required");
        if (!conditioningDTO.weight)  throw new Error("[400],weight is required");
        if (conditioningDTO.weight<1) throw new Error("[400],el peso no puede ser menor a 1");
        if (!conditioningDTO.temperature)  throw new Error("[400],temperature is required");
        if (isNaN(conditioningDTO.productId) || conditioningDTO.productId < 1)  throw new Error("[400],productId is required");
        if (!conditioningDTO.date)  throw new Error("[400],date is required");

        let process: Process = await this.processRepository.findProcessById(+processId);
    if(!process) throw new Error("[400], no existe proceso");
    console.log(process); 
    if(process.conditioningId) throw new Error("[400], este proceso ya tiene acondicionamiento asignado");
        
    let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByProductId(conditioningDTO.productId);
    if(!product) throw new Error("[400], no existe producto Rovianda");
    console.log(product)
    //let productConditioning = await this.conditioningRepository.getConditioningByProductId(product.id);
    //if(productConditioning) throw new Error("[400], este producto ya tiene acondicionamiento asignado");
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
            if(!process.loteInterno) { process.loteInterno = conditioningDTO.lotMeat }
            process.currentProcess = "Acondicionamiento ";
            process.conditioningId = lastConditioning;
    
            return await this.processRepository.createProcess(process);    
    }


    async getConditioningById(conditioning_id:number){
        return await this.conditioningRepository.getConditioningById(conditioning_id);
    }

    async getConditioning(processId:string){
    
        if (!processId) throw new Error("[400], processId in path is required");
        let process:Process = await this.processRepository.findProcessById(+processId)
        if(!process)throw new Error("[404], No existe proceso");
        console.log(process);
       
        let conditioning:Process = await this.processRepository.findConditioningByProcessId(+processId);
        console.log(conditioning)
        if(conditioning.conditioningId ==null) throw new Error("[404], no existe tenderized relacionado a este proceso");
        console.log(conditioning.conditioningId);
        let product = await this.processRepository.findProductByProcessId(+processId);
        if(product.product==null) throw new Error("[404], no existe product relacionado a este proceso");
        console.log(product.product);
        let response = ({
            rawMaterial: `${conditioning.conditioningId.raw}`,
            clean: `${conditioning.conditioningId.clean}`,
            healthing: `${conditioning.conditioningId.healthing}`,
            weight: `${conditioning.conditioningId.weight}`,
            temperature: `${conditioning.conditioningId.temperature}`,
            product: {
                id: `${product.product.id}`,
                description: `${product.product.name}`
            },
            date: `${conditioning.conditioningId.date}`,
        });
        return response;
    }

    async getConditioningByProcessId(id:number){
        return await this.conditioningRepository.getConditioningById(id);
    }
}