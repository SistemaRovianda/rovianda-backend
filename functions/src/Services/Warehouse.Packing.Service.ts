import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";
import { WarehouseDTO, WarehousePackingDTO } from "../Models/DTO/WarehouseDTO";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Product } from "../Models/Entity/Product";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { Request } from "express";
import { EntrancePackingRepository } from "../Repositories/Entrance.Packing.Repository";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";

export class WarehousePackingService{
    private warehousePackingRepository:WarehousePackingRepository;
    private productRepository:ProductRepository;
    private entrancePackingRepository:EntrancePackingRepository;
    constructor(){
        this.warehousePackingRepository = new WarehousePackingRepository();
        this.productRepository = new ProductRepository();
        this.entrancePackingRepository = new EntrancePackingRepository();
    }
    
    async updateWarehouseStatus(warehousePackinDTO:WarehousePackingDTO){
        if(!warehousePackinDTO.date) throw new Error("[400], date is required");
        if(!warehousePackinDTO.status) throw new Error("[400], status is requires");
        if(!warehousePackinDTO.warehouseId) throw new Error("[400], warehouseId is required");
        let warehousePacking:WarehousePacking = await this.warehousePackingRepository.findWarehousePackingById(warehousePackinDTO.warehouseId);
        if(!warehousePacking) throw new Error("[404], warehousePacking not found");

        switch(warehousePackinDTO.status){
            case WarehouseStatus.OPENED:
                warehousePacking.status=WarehouseStatus.OPENED;
                warehousePacking.openingDate = warehousePackinDTO.date;
                break;
            case WarehouseStatus.CLOSED:
                warehousePacking.status=WarehouseStatus.CLOSED;
                warehousePacking.closingDate = warehousePackinDTO.date;
                break;
            default:
                throw new Error("[400], status no valido");
                break;
        }

        await this.warehousePackingRepository.saveWarehousePacking(warehousePacking);
        
    }

    // async getWarehousePackingById(id:number){
    //     return await this.warehousePackingRepository.getWarehousePackingfById(id);
    // }

    
    async getWarehousePackingByStatus(status:string){
        let warehousePackingStatus = await this.warehousePackingRepository.getWarehousePackingByStatusGroup(status);
        let response:any = [];
        for(let i = 0; i<warehousePackingStatus.length; i++){
            let warehousePackingLote = await this.warehousePackingRepository.getWarehousePackingByLoteProveedor(warehousePackingStatus[i].lote_proveedor,status);
            let response1:any = [];
            for(let n = 0; n<warehousePackingLote.length; n++){
                let entrancePaking = await this.entrancePackingRepository.getEntrnacePackingByLotProduct(warehousePackingLote[n].lote_proveedor,warehousePackingLote[n].productId)
                if(entrancePaking.length){
                    if(entrancePaking[0].quality == true && entrancePaking[0].strange_material == true && 
                        entrancePaking[0].transport == true && entrancePaking[0].paking == true){
                            response1.push({
                                id: `${warehousePackingLote[n].productId}`,
                                description: `${warehousePackingLote[n].description}`,
                                warehousePackingId: `${warehousePackingLote[n].id}`,
                                quantity: `${warehousePackingLote[n].quantity}`
                            });
                        }
                }
            }
            response.push({
                loteId: `${warehousePackingStatus[i].lote_proveedor}`,
                products: response1
            })
        }
        return response;
    }

    async getWarehousePackingRepositoryByStatusProduct(status:string){
        let warehousePackingStatus = await this.warehousePackingRepository.getWarehousePackingByStatusGroupProduct(status);
        console.log(warehousePackingStatus)
        let response:any = [];
        for(let i = 0; i < warehousePackingStatus.length; i++){
            response.push({
                productId: `${warehousePackingStatus[i].productId}`,
                product: `${warehousePackingStatus[i].description}`
            })
        }
        return response;
    }
    


    async saveWarehousePacking(warehousePacking:WarehousePacking){
        return await this.warehousePackingRepository.saveWarehousePacking(warehousePacking);
    }
    
    async getPackingHistory(lotIdProveedor:string){

        let warehousePacking:WarehousePacking[] = await this.warehousePackingRepository.getWarehousePackingfByLote(lotIdProveedor);
        if(!warehousePacking.length) throw new Error(`[404], warehousePacking with lot ${lotIdProveedor} was not found`);
            console.log(warehousePacking);
        let response:any = [];
        for(let i = 0; i < warehousePacking.length; i++){
            let entrancePacking:EntrancePacking = await this.entrancePackingRepository.getEntrnacePackingByLotProveedorProduct(warehousePacking[i].loteProveedor,warehousePacking[i].product);
            let outputs=[];
            if(warehousePacking[i].outputsPacking.length){
                outputs = warehousePacking[i].outputsPacking.map(output =>{ 
                    return {
                        outputName: output.operatorOutlet,
                        date: output.date
                    }
                })
            }
            response.push({
                entrancePackingId: entrancePacking ? entrancePacking.id : "",
                receptionDate: warehousePacking[i].date,
                openingDate: warehousePacking[i].openingDate,
                closedDate: warehousePacking[i].closingDate,
                outputs
            })
        }
        // let outputs=[];
        // if(warehousePacking.outputsPacking.length){
        //     outputs = warehousePacking.outputsPacking.map(output =>{ 
        //         return {
        //             outputName: output.operatorOutlet,
        //             date: output.date
        //         }
        //     })
        // }
        // let response = {
        //     receptionDate: warehousePacking.date,
        //     openingDate: warehousePacking.openingDate,
        //     closedDate: warehousePacking.closingDate,
        //     outputs
        // }

        // return response;
        return response;
    }

    async getLotsPackingByProduct(productId:number){
        if(!productId) throw new Error(`[400], productId is required`);
        let product:Product = await this.productRepository.getProductById(productId);
        if(!product) throw new Error(`[400], productId is required`);
        let response:any = [];
        let lot:WarehousePacking[] = await this.warehousePackingRepository.findLotsPackingByProduct(product);
        lot.forEach( i => {
            response.push({
                warehouseId: `${i.id}`,
                lot: `${i.loteProveedor}`
            })
        });
        return response;
    }

}