import { ProductRepository } from '../Repositories/Product.Repository';
import { ErrorHandler } from "../Utils/Error.Handler";
import { OvenRepository } from '../Repositories/Oven.Repository';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';
import { Request } from 'express';

export class OvenService{

    private ovenRepository: OvenRepository;
    private productRepository: ProductRepository;

    constructor() {
        this.ovenRepository = new OvenRepository();
        this.productRepository = new ProductRepository();
    }

    async getOvenProducts() {
        return await this.ovenRepository.getOvenProducts();
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
}