import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Request } from 'express';
import { isArguments } from 'lodash';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { PresentationProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
export class PackagingService {

    private packagingRepository: PackagingRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private ovenRepository: OvenRepository;
    private presentationProductRepository: PresentationProductsRepository;
    private propertiePackagingRepository: PropertiesPackagingRepository;

    constructor() {
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.presentationProductRepository = new PresentationProductsRepository();
        this.propertiePackagingRepository = new PropertiesPackagingRepository();
    }

    async savePackaging(req: Request) {
        let { registerDate, productId, lotId, expiration, products } = req.body;
        if (!registerDate)
            throw new Error("[400],registerDate is required");
        if (!productId)
            throw new Error("[400],productId is required");
        if (isNaN(productId))
            throw new Error("[400],productId has invalid format, productId must be a numeric value");
        if (!lotId)
            throw new Error("[400],lotId is required");
        if (isNaN(lotId))
            throw new Error("[400],lotId has invalid format, lotId must be a numeric value")
        if (!expiration)
            throw new Error("[400],expiration is required");
        if (isNaN(expiration))
            throw new Error("[400],expiration has invalid format, expiration must be a numeric value");
        if (!products)
            throw new Error("[400],products is required");

        let presentations: PresentationProducts[] = [];

        for (let product of products) {
            if (!product.presentationId)
                throw new Error("[400],a product is missing presntationId");
            if (isNaN(product.presentationId))
                throw new Error("[400],presentationId in one of the products has invalid format");
            if (!product.pieces)
                throw new Error("[400],a product is missing pieces attribute");
            if (isNaN(product.pieces))
                throw new Error("[400],pieces in one of the products has invalid format");
            if (!product.packs)
                throw new Error("[400],a product is missing packs attribute");
            if (isNaN(product.packs))
                throw new Error("[400],packs in one of the products has invalid format");
            if (!product.weight)
                throw new Error("[400],a product is missing weight attribute");
            if (isNaN(product.weight))
                throw new Error("[400],weight in one of the products has invalid format");
            let presentation = await this.presentationProductRepository.getPresentationProductsById(product.presentationId);
            if (!presentation)
                throw new Error(`[404], Presentation product with id ${product.presentationId} was not found`);
            presentations.push(presentation);
        }

        let productRovianda = await this.productRoviandaRepository.getProductRoviandaById(+productId);

        if (!productRovianda)
            throw new Error(`[404],product rovianda with id ${productId} was not found`);

        let ovenProduct = await this.ovenRepository.getOvenProductById(lotId);
        if (!ovenProduct)
            throw new Error(`[404],oven product with id ${lotId} was not found`);


        let packaging: Packaging = {
            id: 0,
            expiration,
            productId: productRovianda,
            lotId: ovenProduct.id,
            registerDate,
            jobElabored: null,
            jobVerify: null,
            nameElabored: null,
            nameVerify: null,
            propertiesPackaging: null

        }
        try {

            let packagingSaved = await this.packagingRepository.savePackaging(packaging);
            let index = 0;
            for (let product of products) {
                let propertiePackaging: PropertiesPackaging = {
                    id: 0,
                    boxPackaging: null,
                    observations: product.observations,
                    packaging: packagingSaved,
                    packs: product.packs,
                    pieces: product.pieces,
                    presentationProduct: presentations[index],
                    weight: product.weight
                }
                await this.propertiePackagingRepository.savePropertiesPackaging(propertiePackaging);
                index++;
            }
        } catch (error) {
            throw new Error(`[500],${error}`);
        }

    }

    async getProducts() {
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string) {

    }

}