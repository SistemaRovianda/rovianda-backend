import { OvenRepository } from "../Repositories/Oven.Repository";
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { ProductRepository } from '../Repositories/Product.Repository';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';
import { Request } from 'express';
import { Process } from '../Models/Entity/Process';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { RevisionsOvenProducts } from '../Models/Entity/Revisions.Oven.Products';
import { RevisionsOvenProductsRepository } from '../Repositories/Revisions.Oven.Products.Repository';
import { OvenDTO } from '../Models/DTO/OvenProductDTO';
import { Product } from '../Models/Entity/Product';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { OvenController } from "../Controllers/Oven.Controller";

export class OvenService{

    private ovenRepository: OvenRepository;
    private productRepository: ProductRepository;
    private processRepository: ProcessRepository;
    private userRepository: UserRepository;
    private revisionsOvenProductsRepository:RevisionsOvenProductsRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    constructor() {
        this.ovenRepository = new OvenRepository();
        this.productRepository = new ProductRepository();
        this.processRepository = new ProcessRepository();
        this.userRepository = new UserRepository();
        this.revisionsOvenProductsRepository = new RevisionsOvenProductsRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
    }

    async getOvenProducts() {
        let oven = await this.ovenRepository.getOvenProducts();
        let response = [];
        for(let i =0; i<oven.length; i++){
            response.push({
                ovenProductId: `${oven[i].id}`,
                pcc: `${oven[i].pcc}`,
                oven: `${oven[i].oven}`,
                product: {
                    id: `${oven[i].product_id}`,
                    description: `${oven[i].name}`, 
                },
                newLotId: `${oven[i].new_lote}`,
                date: `${oven[i].date}`
            });
        }
        return response;
    }

    async getOvenProductsByProductId(req:Request){
        if(!req.params.productId) throw new Error("[400], productId is required");
        let oven:any = await this.ovenRepository.getOvenProductsById(+req.params.productId);
        if(!oven) throw new Error("[404], oven not found");
        let ovencons:OvenProducts = await this.ovenRepository.ById(+req.params.productId);
        let revision:RevisionsOvenProducts[] = await this.revisionsOvenProductsRepository.getByOven(ovencons);
        let response2:any = []
        revision.forEach(i=>{
            response2.push({
                hour: `${i.hour}`,
                interTemp: `${i.interTemp}`,
                ovenTemp: `${i.ovenTemp}`,
                humidity: `${i.humidity}`,
                observations: `${i.observations}`
            });
        })
        console.log(oven)
        let response:any = {};
        response = {
            ovenProductId: `${oven[0].id}`,
            estimatedTime: `${oven[0].product_id}`,
            newLote: `${oven[0].new_lote}`,
            pcc: `${oven[0].pcc}`,
            oven: `${oven[0].oven}`,
            product: {
                id: `${oven[0].product_id}`,
                description: `${oven[0].name}`
            },
            date: `${oven[0].date}`,
            revisions: response2
        };

        return response;
    }

    async updateOvenProductStatus(id: number) {

        if (isNaN(+id) || +id < 1)
            throw new Error(`[400],invalid id param value`);

        let ovenProducts: OvenProducts | undefined = await this.ovenRepository.findOvenProductById(id);

        if(!ovenProducts)
            throw new Error(`[404],OvenProduct with id ${id} was not found`);

        ovenProducts.status = OvenProductStatusEnum.CLOSED;

        try {
            await this.ovenRepository.saveOvenProduct(ovenProducts);
        } catch (err) {
            throw new Error(`[500], ${ err.message }`);
        }
    }

    async saveOvenUser(processId:number , ovenUserDTO:OvenDTO){

        if(!ovenUserDTO.nameVerify) throw new Error("[400], nameVerify is required");
        if(!ovenUserDTO.jobVerify) throw new Error("[400], jobVerify is required");
        if(!ovenUserDTO.nameElaborated) throw new Error("[400], nameElaborated is required");
        if(!ovenUserDTO.jobElaborated) throw new Error("[400], jobElaborated is required");
        if(!ovenUserDTO.nameCheck) throw new Error("[400], nameCheck is required");
        if(!ovenUserDTO.jobCheck) throw new Error("[400], jobCheck is required");
        
        let ovenProducts:OvenProducts = await this.ovenRepository.getOvenProductById(processId);
        if(!ovenProducts) throw new Error("[400], process not found");
        let productId = ovenProducts.product.id;
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        if(!product) throw new Error("[400], product not found");

        let fullVerifit = ovenUserDTO.nameVerify.split(" ");
        let userVerifit = await this.userRepository.getByFullNameJob(fullVerifit[0],fullVerifit[1],fullVerifit[2],ovenUserDTO.jobVerify);
        if (!userVerifit[0])  throw new Error("[404],User Verifit not found");

        let fullElaborated = ovenUserDTO.nameElaborated.split(" ");
        let userElaborated = await this.userRepository.getByFullNameJob(fullElaborated[0],fullElaborated[1],fullElaborated[2],ovenUserDTO.jobElaborated);
        if (!userElaborated[0])  throw new Error("[404],User Elaborated not found");

        let fullCheck = ovenUserDTO.nameCheck.split(" ");
        let userCheck = await this.userRepository.getByFullNameJob(fullCheck[0],fullCheck[1],fullCheck[2],ovenUserDTO.jobCheck);
        if (!userCheck[0])  throw new Error("[404],User Check not found");

        ovenProducts.nameElaborated = ovenUserDTO.nameElaborated;
        ovenProducts.nameVerify = ovenUserDTO.nameVerify;
        ovenProducts.jobElaborated = ovenUserDTO.jobElaborated;
        ovenProducts.jobVerify = ovenUserDTO.jobVerify;
        ovenProducts.jobElaborated = ovenUserDTO.jobElaborated;
        ovenProducts.jobVerify = ovenUserDTO.jobVerify;
        ovenProducts.nameCheck = ovenUserDTO.nameCheck;
        ovenProducts.jobCheck = ovenUserDTO.jobCheck;

        console.log("hecho")
        return await this.ovenRepository.saveOvenUser(ovenProducts);
    }
    

    async saveOvenProduct(ovenDTO:OvenDTO){
        if(!ovenDTO.estimatedTime) throw new Error("[400], estimatedTime is required");
        if(!ovenDTO.newLote) throw new Error("[400], newLote is required");
        if(!ovenDTO.pcc) throw new Error("[400], pcc is required");
        if(!ovenDTO.productId) throw new Error("[400], productId is required");
        if(!ovenDTO.date) throw new Error("[400], date is required");
        if(!ovenDTO.oven) throw new Error("[400], oven is required");
        if(!ovenDTO.firstRevision.hour) throw new Error("[400], hour is required");
        if(!ovenDTO.firstRevision.interTemp) throw new Error("[400], interTemp is required");
        if(!ovenDTO.firstRevision.ovenTemp) throw new Error("[400], ovenTemp is required");
        if(!ovenDTO.firstRevision.humidity) throw new Error("[400], humidity is required");
        if(isNaN(+ovenDTO.productId)) throw new Error("[400],El productId debe ser un numero");
        console.log("se obtiene el proceso")
        let process:any = await this.processRepository.getProceesByLot(ovenDTO.newLote,+ovenDTO.productId);
        console.log(process)
        console.log("se obtuvo el proceso")
        if(!process[0]) throw new Error("[404],no existe el proceso");
        if(process[0].status == "COOKING") throw new Error("[400], process is COOKING");
        process[0].status = " ";
        await this.processRepository.createProcess(process[0]);
        console.log("hace0aaa0")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+ovenDTO.productId);
        console.log("hace0a0ss")
        if(!product) throw new Error("[400], product not found");
        let oven:OvenProducts = new OvenProducts();
        oven.stimatedTime = ovenDTO.estimatedTime;
        oven.newLote = ovenDTO.newLote;
        oven.pcc = ovenDTO.pcc;
        oven.oven = ovenDTO.oven;
        oven.date = ovenDTO.date;
        oven.product = product;
        await this.ovenRepository.saveOvenProduct(oven);
        console.log("hace0a0")
        let ovenObj:OvenProducts[] = await this.ovenRepository.getLastOven();
        console.log("hace00ss")
        let revisionsOvenProducts: RevisionsOvenProducts = new RevisionsOvenProducts();
        revisionsOvenProducts.hour = ovenDTO.firstRevision.hour;
        revisionsOvenProducts.interTemp = ovenDTO.firstRevision.interTemp;
        revisionsOvenProducts.ovenTemp = ovenDTO.firstRevision.ovenTemp;
        revisionsOvenProducts.humidity = ovenDTO.firstRevision.humidity;
        revisionsOvenProducts.observations = ovenDTO.firstRevision.observations;
        revisionsOvenProducts.ovenProducts = ovenObj[0];
        return await this.revisionsOvenProductsRepository.saveRevisionsOvenProducts(revisionsOvenProducts);
    }

    async getOvenProductUserById(id: number ){
        let ovenProduct = await this.ovenRepository.findOvenProductById(+id);
        
        if (!ovenProduct)
            throw new Error(`[404], OvenProduct with id ${id} was not found`);
    
        let response = {
            nameElaborated: ovenProduct.nameElaborated,
            jobElaborated: ovenProduct.jobElaborated,
            nameVerify: ovenProduct.nameVerify,
            jobVerify: ovenProduct.jobVerify
        }

        return response;
    }

    async getProductsByOvenClosed(){
        let ovensClosed = await this.ovenRepository.getProductsByOvenClosed();
        console.log(ovensClosed);
        let result = ovensClosed.map(ovenClosed=>{
            return {
                productId: ovenClosed.product.id,
                name: ovenClosed.product.name,
                lot: ovenClosed.newLote
            }
        })
        return result;
    }

    async getDataReport(id:string){
        let ovenProduct:OvenProducts =await this.ovenRepository.getOvenProductById(+id);
        if (!ovenProduct)throw new Error(`[404], OvenProduct with id :${id} was not found`)
        return ovenProduct
    }

    async getReportOvenProducts(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], iniDate cannot be greater than finDate`);
        let ovenProducts:OvenProducts[]= await this.ovenRepository.getOvenProductsByDates(dateInit,dateEnd);
        return ovenProducts
    }

}