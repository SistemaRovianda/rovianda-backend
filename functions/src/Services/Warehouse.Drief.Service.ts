import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { EntranceDriefRepository } from "../Repositories/Entrance.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { Request } from "express";
import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { Formulation } from "../Models/Entity/Formulation";
import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { LotInternalByLotDrief } from "../Models/DTO/LotInternalByLotDrief";
import { forEach } from "lodash";
import { FormulatioIngredientsRepository } from "../Repositories/Formulation.Ingredients.Repository";
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { EntranceDrief } from "../Models/Entity/Entrances.Drief";

export class WarehouseDriefService{
    private warehouseDriefRepository:WarehouseDriefRepository;
    private productRepository:ProductRepository;
    private entranceDriefRepository:EntranceDriefRepository;
    private formulationRepository:FormulationRepository;
    private outputsDriefRepository: OutputsDriefRepository;
    private formulationIngredentsRepository:FormulatioIngredientsRepository;
    constructor(){
        this.warehouseDriefRepository = new WarehouseDriefRepository();
        this.productRepository = new ProductRepository();
        this.entranceDriefRepository = new EntranceDriefRepository();
        this.formulationRepository = new FormulationRepository();
        this.outputsDriefRepository = new OutputsDriefRepository();
        this.formulationIngredentsRepository = new FormulatioIngredientsRepository();
    }

    async updateWarehouseDrief(warehouseDTO:WarehouseDTO,warehouseDriefId:number){
        if(!warehouseDriefId) throw new Error("[400], warehouseDriefId es requerido");
        if(!warehouseDTO.loteId) throw new Error("[400], loteId es requerido");
        if(!warehouseDTO.productId) throw new Error("[400], productId es requerido");
        if(!warehouseDTO.date) throw new Error("[400], date es requerido");
        if(!warehouseDTO.status) throw new Error("[400], status es requerido");
        let product:Product = await this.productRepository.getProductById(warehouseDTO.productId);
        if(!product) throw new Error("[404], el producto no existe");
        let lote:WarehouseDrief[] = await this.warehouseDriefRepository.getWarehouseDriefByLoteIdAndProductId(warehouseDTO.loteId,warehouseDTO.productId);
        if(!lote.length) throw new Error("[404], el lote no existe");
        let warehouseDrief:WarehouseDrief = await this.warehouseDriefRepository.getWarehouseDriefByIds(warehouseDriefId);
        if(!warehouseDrief) throw new Error(`[404], WarehouseDrief with Id ${warehouseDriefId} not found`);
        
        switch(warehouseDTO.status){
            case WarehouseStatus.CLOSED:
                warehouseDrief.status = WarehouseStatus.CLOSED;
                warehouseDrief.closingDate = warehouseDTO.date;
                break;
            case WarehouseStatus.OPENED:
                warehouseDrief.status = WarehouseStatus.OPENED;
                warehouseDrief.openingDate = warehouseDTO.date;
                break;
            default:
                throw new Error("[400], el valor del status es invalido");
                break;
        }

        await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
    }

   

    async createWarehouseDrief(warehouseDrief:WarehouseDrief){
        return await this.warehouseDriefRepository.saveWarehouseDrief(warehouseDrief);
    }
    
    // async getWarehouseDriefRepositoryById(id:number){
    //     return await this.warehouseDriefRepository.getWarehouseDriefById(id);
    // }

    
    async getWarehouseDriefRepositoryByStatus(status:string){
        let warehouseDriefStatus = await this.warehouseDriefRepository.getWarehouseDriefByStatusGroup(status);
        let response:any = [];
        for(let i = 0; i<warehouseDriefStatus.length; i++){
            let warehouseDriefLote = await this.warehouseDriefRepository.getWarehouseDriefByLoteProveedor(warehouseDriefStatus[i].lote_proveedor,status);
            let response1:any = [];
            for(let n = 0; n<warehouseDriefLote.length; n++){
                let entranceDrief = await this.entranceDriefRepository.getEntrnaceDriefByLotProduct(warehouseDriefLote[n].lote_proveedor,warehouseDriefLote[n].productId);
                console.log("entranceDrief[0]")
                console.log(entranceDrief[0])
                if(entranceDrief.length){
                    if(entranceDrief[0].quality == true && entranceDrief[0].expiration == true && 
                        entranceDrief[0].transport == true && entranceDrief[0].strange_material == true &&
                        entranceDrief[0].paking == true && entranceDrief[0].color == true &&
                        entranceDrief[0].texture == true && entranceDrief[0].weight == true &&
                        entranceDrief[0].odor == true){
                            response1.push({
                                id: `${warehouseDriefLote[n].productId}`,
                                warehouseDriefId: `${warehouseDriefLote[n].id}`,
                                quantity: `${warehouseDriefLote[n].quantity}`,
                                description: `${warehouseDriefLote[n].description}`
                            });
                        }
                }
            }
            response.push({ 
                loteId: `${warehouseDriefStatus[i].lote_proveedor}`,
                products: response1
            })
        }
        return response;
    }

    async getWarehouseDriefRepositoryByStatusProduct(status:string){
        let warehouseDriefStatus = await this.warehouseDriefRepository.getWarehouseDriefByStatusGroupProduct(status);
        console.log(warehouseDriefStatus)
        let response:any = [];
        for(let i = 0; i < warehouseDriefStatus.length; i++){
            response.push({
                productId: `${warehouseDriefStatus[i].productId}`,
                product: `${warehouseDriefStatus[i].description}`
            })
        }
        return response;
    }

    async getDriefHistory(lotIdProveedor:string) {

        let warehouseDrief:WarehouseDrief[] = await this.warehouseDriefRepository.getWarehouseDriefByLotProveedor(lotIdProveedor);
        console.log(warehouseDrief);
        if (!warehouseDrief.length) throw new Error(`[404], warehouseDrief with lot ${lotIdProveedor} was not found`);
        let response:any = [];
        for(let e = 0; e < warehouseDrief.length; e++){
            let entranceDrief:EntranceDrief = await this.entranceDriefRepository.getEntrnaceDriefByLotProveedorProduct(warehouseDrief[e].loteProveedor,warehouseDrief[e].product)
            let response2:any = [];
            let outputs:OutputsDrief[] = warehouseDrief[e].outputDriefs;
            //let aplications:Array<LotInternalByLotDrief> = await this.formulationRepository.getLotInternalByLotDrief(lotIdProveedor);
            for(let i = 0; i < outputs.length; i++){
                let formulationIngredients:FormulationIngredients = await this.formulationIngredentsRepository.getByOutputsDrief(outputs[i]);
                if(formulationIngredients){
                response2.push({
                    outputDate: outputs[i].date,
                    product: outputs[i].product ? outputs[i].product.description :  "",
                    productId: outputs[i].product ? outputs[i].product.id : "",
                    observations: outputs[i].observations ? outputs[i].observations : "",
                    lot: formulationIngredients.formulation?formulationIngredients.formulation.lotDay:null,
                    productRovianda: formulationIngredients.formulation?formulationIngredients.formulation.productRovianda.name:null
                })
            
                }
            }
            response.push({
                entranceDriefId: entranceDrief ? entranceDrief.id : "",
                receptionDate: warehouseDrief[e].date,
                openingDate: warehouseDrief[e].openingDate,
                closedDate: warehouseDrief[e].closingDate,
                outputs: response2
            })
        }
        
        return response;
    }

    async getAllWarehouseDrief(){
        let warehouseDrief:WarehouseDrief[] = await this.warehouseDriefRepository.getAllWarehouseDrief();
        let response:any = [];
        warehouseDrief.forEach(i => {
            response.push({
                warehouseDriefId:`${i.id}`,
                loteProveedor: `${i.loteProveedor}`,
                quantity: `${i.quantity}`
            });
        });
        return response;
    }

    async getDataReport(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], initDate cannot be greater than finalDate`);

        return await this.warehouseDriefRepository.getWarehouseDriefReport(dateInit,dateEnd);
    }

    async getLotsByProduct(productId:number,status:string){
        if(!productId) throw new Error(`[400], productId is required`);
        let product:Product = await this.productRepository.getProductById(productId);
        if(!product) throw new Error(`[400], productId is required`);
        let response:any = [];
        let lot:WarehouseDrief[] = await this.warehouseDriefRepository.findLotsByProduct(product,status);
        lot.forEach( i => {
            response.push({
                warehouseId: `${i.id}`,
                lot: `${i.loteProveedor}`
            })
        });
        return response;
    }

}