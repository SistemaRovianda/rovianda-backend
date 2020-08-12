import { TenderizedRepository } from '../Repositories/Tenderized.Repository';
import { Tenderized } from '../Models/Entity/Tenderized';
import { TenderizedDTO } from '../Models/DTO/TenderizedDTO';
import { Product } from '../Models/Entity/Product';
import { ProductRepository } from '../Repositories/Product.Repository';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';


export class TenderizedService{
    private tenderizedRepository : TenderizedRepository;
    private productRepository : ProductRepository;
    private processRepository :ProcessRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    constructor(){
        this.tenderizedRepository = new TenderizedRepository();
        this.productRepository = new ProductRepository();
        this.processRepository = new ProcessRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
    }
 
    async createTenderized(tenderizedDTO:TenderizedDTO, processId:string){
        
        console.log(processId);
        if(!processId)throw new Error("[400], processId in path is required");
        let process :Process = await this.processRepository.findTenderizedByProcessId(+processId);
        if(!process)throw new Error("[404], no existe proceso");
        if(!tenderizedDTO.date) throw new Error("[400], falta el parametro date");
        if(!tenderizedDTO.loteMeat) throw new Error("[400], falta el parametro loteMeat");
        if(!tenderizedDTO.percentage) throw new Error("[400], falta el parametro percentage");
        if(!tenderizedDTO.productId) throw new Error("[400], falta el parametro productId");
        if(!tenderizedDTO.temperature) throw new Error("[400], falta el parametro temperature");
        if(!tenderizedDTO.weight) throw new Error("[400], falta el parametro weight");
        if(!tenderizedDTO.weightSalmuera) throw new Error("[400], falta el parametro weightSalmuera");
        let product :ProductRovianda = await this.productRoviandaRepository.getById(tenderizedDTO.productId);
        if(!product) throw new Error("[400],No existe producto");
        if(process.tenderizedId!=null) throw new Error("[409],el proceso ya tiene tenderizado registrado");
     
        let tenderized: Tenderized = new Tenderized();
        tenderized.date = tenderizedDTO.date;
        tenderized.percentInject = tenderizedDTO.percentage;
        tenderized.productId = product;
        tenderized.temperature = tenderizedDTO.temperature;
        tenderized.weight = tenderizedDTO.weight;
        tenderized.loteMeat = tenderizedDTO.loteMeat;
        tenderized.weightSalmuera = tenderizedDTO.weightSalmuera;
        await this.tenderizedRepository.createTenderized(tenderized);
        
        let lastTenderized:Tenderized = await this.tenderizedRepository.getLastTenderized();
        process.tenderizedId = lastTenderized;
        process.currentProcess = "Inyecion-Tenderizado";
        return await this.processRepository.saveProcess(process);
    }
    
    async getTenderizedById(id:number){
        return await this.tenderizedRepository.getTenderizedById(id);
    }

    async getProductTenderized(processid:number){
        return await this.tenderizedRepository.getProductTenderized(processid);
    }

    async getTenderized(processId:string){
    
        if (!processId) throw new Error("[400], processId in path is required");
        let process:Process = await this.processRepository.findProcessById(+processId)
        if(!process)throw new Error("[404], No existe proceso");
        console.log(process);
       
        let tenderized = await this.processRepository.findTenderizedByProcessId(+processId);
        if(tenderized.tenderizedId==null) throw new Error("[404], no existe tenderized relacionado a este proceso");
        console.log(tenderized.tenderizedId);
        let product = await this.processRepository.findProductByProcessId(+processId);
        if(product.product==null) throw new Error("[404], no existe product relacionado a este proceso");
        console.log(product.product);
        let response = ({
            temperature: `${tenderized.tenderizedId.temperature}`,
            weight: `${tenderized.tenderizedId.weight}`,
            weight_salmuera: `${tenderized.tenderizedId.weightSalmuera}`,
            percentage: `${tenderized.tenderizedId.percentInject}`,
            date: `${tenderized.tenderizedId.date}`,
            product: {
                id: `${product.product.id}`,
                description: `${product.product.name}`
            },
            loteMeat: `${tenderized.tenderizedId.loteMeat}`
        });
        return response;
    
    }

    async getTenderizedByProcessId(id:number){
        return await this.tenderizedRepository.getTenderizedById(id);
    }
}