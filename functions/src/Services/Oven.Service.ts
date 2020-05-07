import { ProductRepository } from '../Repositories/Product.Repository';
import { ErrorHandler } from "../Utils/Error.Handler";
import { OvenRepository } from '../Repositories/Oven.Repository';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';

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