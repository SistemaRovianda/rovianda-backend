import { RevisionsOvenProductsRepository } from "../Repositories/Revisions.Oven.Products.Repository";
import { Request } from "express";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { OvenRepository } from "../Repositories/Oven.Repository";
import { OvenProducts } from "../Models/Entity/Oven.Products";
import { RevisionOvenProductDTO } from "../Models/DTO/RevisionOvenProductDTO";
import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
export class RevisionOvenProductService {
    private revisionOvenProductRepository: RevisionsOvenProductsRepository;
    private productRepository: OvenRepository;
    constructor() {
        this.revisionOvenProductRepository = new RevisionsOvenProductsRepository();
        this.productRepository = new OvenRepository();
    }

    async createRevisionOvenProduct(req: Request) {
        let id = req.params.productId;

        if (isNaN(+id) || +id < 1)
            throw new Error(`[400], invalid param id`);

        let product: OvenProducts = await this.productRepository.findOvenProductById(+id);

        if (!product)
            throw new Error(`[404], OvenProduct with id ${id} was not found`);
        let revisionOvenProductDTO: RevisionOvenProductDTO = req.body;
        if (!revisionOvenProductDTO.hour)
            throw new Error("[400], hour is required");

        if (!revisionOvenProductDTO.humidity)
            throw new Error("[400], humidity is required");

        if (!revisionOvenProductDTO.interTemp)
            throw new Error("[400], interTemp is required");

        if (!revisionOvenProductDTO.observations)
            throw new Error("[400], observations is required");

        if (!revisionOvenProductDTO.ovenTemp)
            throw new Error("[400], ovenTemp is required");

        let revisionOvenProduct: RevisionsOvenProducts = {
            id:0,
            hour: revisionOvenProductDTO.hour,
            humidity: revisionOvenProductDTO.humidity,
            interTemp: revisionOvenProductDTO.interTemp,
            observations: revisionOvenProductDTO.observations,
            ovenTemp: revisionOvenProductDTO.ovenTemp,
            ovenProducts: product
        }
        try {
            await this.revisionOvenProductRepository.saveRevisionsOvenProducts(revisionOvenProduct);
        }catch(error){
            console.log(error.message);
            throw new Error("[500], Cannot save revision product");
        }
    }
}