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
                oven_product_id: `${oven[i].id}`,
                pcc: `${oven[i].pcc}`,
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
        let oven:OvenProducts[] = await this.ovenRepository.getOvenProductsById(+req.params.productId);
        if(!oven) throw new Error("[404], oven not found");
        let response:any = {};
        oven.forEach( async (i:any) => {
            response = {
                ovenProductId: `${i.id}`,
                estimatedTime: `${i.product_id}`,
                newLote: `${i.new_lote}`,
                pcc: `${i.pcc}`,
                product: {
                    id: `${i.product_id}`,
                    description: `${i.description}`
                },
                date: `${i.date}`,
                revisions: [{
                    hour: `${i.hour}`,
                    interTemp: `${i.inter_temp}`,
                    ovenTemp: `${i.oven_temp}`,
                    humidity: `${i.humidity}`,
                    observations: `${i.observations}`
                }
                ]
            };
        });

        return response;
    }

    async updateOvenProductStatus(id: number) {

        if (isNaN(+id) || +id < 1)
            throw new Error(`[400],invalid id param value`);

        let ovenProducts: OvenProducts | undefined = await this.ovenRepository.findOvenProductById(id);

        if (!ovenProducts)
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
        
        let process:Process = await this.processRepository.findProcessById(processId);
        console.log(process);
        if(!process) throw new Error("[400], process not found");
        if(!process.product) throw new Error("[400], The process has no assigned product ");
        let productId = process.product.id;
        console.log(productId);
        console.log("inicio")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        console.log("Consulta")
        if(!product) throw new Error("[400], product not found");
        console.log("Consulta")
        let user:User = await this.userRepository.getUserByName(ovenUserDTO.nameElaborated);
        if(!user) throw new Error("[400], user not found");

        let ovenUser:OvenProducts = await this.ovenRepository.getOvenProductByProductId(productId);
        if(!ovenUser) throw new Error("[400], Oven product not found");
        console.log(ovenUser)
        ovenUser[0].nameElaborated = ovenUserDTO.nameElaborated;
        ovenUser[0].nameVerify = ovenUserDTO.nameVerify;
        ovenUser[0].jobElaborated = ovenUserDTO.jobElaborated;
        ovenUser[0].jobVerify = ovenUserDTO.jobVerify;

        console.log("hecho")
        return await this.ovenRepository.saveOvenUser(ovenUser);
    }
    

    async saveOvenProduct(ovenDTO:OvenDTO){
        if(!ovenDTO.estimatedTime) throw new Error("[400], estimatedTime is required");
        if(!ovenDTO.newLote) throw new Error("[400], newLote is required");
        if(!ovenDTO.pcc) throw new Error("[400], pcc is required");
        if(!ovenDTO.productId) throw new Error("[400], productId is required");
        if(!ovenDTO.date) throw new Error("[400], date is required");
        if(!ovenDTO.firstRevision.hour) throw new Error("[400], hour is required");
        if(!ovenDTO.firstRevision.interTemp) throw new Error("[400], interTemp is required");
        if(!ovenDTO.firstRevision.ovenTemp) throw new Error("[400], ovenTemp is required");
        if(!ovenDTO.firstRevision.humidity) throw new Error("[400], humidity is required");
        if(!ovenDTO.firstRevision.observations) throw new Error("[400], observations is required");
        console.log("hace00")
        let process:Process[] = await this.processRepository.getProceesByLot(ovenDTO.newLote,+ovenDTO.productId);
        console.log("hace00")
        if(!process.length) throw new Error("[404],no existe el proceso");
        if(process[0].status == "COOKING") throw new Error("[400], process is COOKING");
        process[0].status = "COOKING";
        await this.processRepository.createProcess(process[0]);
        console.log("hace0aaa0")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+ovenDTO.productId);
        console.log("hace0a0ss")
        if(!product) throw new Error("[400], product not found");
        let oven:OvenProducts = new OvenProducts();
        oven.stimatedTime = ovenDTO.estimatedTime;
        oven.newLote = ovenDTO.newLote;
        oven.pcc = ovenDTO.pcc;
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

}