import {Request,Response} from 'express';
import { ProductService } from '../Services/Product.Services';
import { Product } from '../Models/Entity/Product';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';

export class ProductController{

    private productService:ProductService;
    private productRoviandaService:ProductRoviandaService;
    constructor(){
        this.productService = new ProductService();
        this.productRoviandaService = new ProductRoviandaService();
    }


    async createProductCatalog(req:Request,res:Response){
        await this.productService.createProduct(req);
        return res.status(201).send();
    }

    async getAllProductsCatalogByType(req:Request,res:Response){
        let products:Product[] = await this.productService.getAllProducts(req.params.type);   
        return res.status(200).send(products);
    }

    async createProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.saveProductRovianda(req.body);
        return res.status(201).send();
    }

    async getProductRovianda(req:Request,res:Response){
        let productRovianda = await this.productRoviandaService.getProductRovianda(req);
        return res.status(200).send(productRovianda);    
    }

    async deleteProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.deleteProductRovianda(req);
        return res.status(204).send();
    }

    async getAllProductsRovianda(req:Request,res:Response){
        let productsRovianda:Array<ProductRovianda> = await this.productRoviandaService.getAllProductsRovianda();
        return res.status(200).send(productsRovianda);
    }

    async getProductsByLotId(req:Request,res:Response){
        let products:Product[] = await this.productService.getProductsByLotId(+req.params.lotId);
        return res.status(200).send(products);
    }

    async getProductsPresentationByRoviandaId(req: Request, res: Response){
        const response = await this.productRoviandaService.getProductsPresentationByRoviandaId(req);
        return res.status(200).send(response)
    }

    async addIngredent(req:Request,res:Response){
        await this.productService.addIngredent(req.body);
        return res.status(201).send();
    }

    async getAllIngredents(req:Request,res:Response){
        let response = await this.productService.getAllIngredents(req.query.type);
        return res.status(200).send(response);
    }

    async deleteIngredent(req:Request,res:Response){
        await this.productService.deleteIngredent(+req.params.ingredientId);
        return res.status(204).send();
    }

    async getAllProductRovianda(req:Request,res:Response){
        let response = await this.productRoviandaService.getAllProductRoviandaState();
        return res.status(200).send(response);
    }

}   
//     async createProduct(req:Request,res:Response){
//         let {description} = req.body;
//             if (!description) return res.status(400).send({ msg: 'description is required'});
//         let productToSave = new Product();   
//         try{
//                 console.log("inicio")
//                 productToSave.description = description;
//                 console.log("creando")
//                 await this.productService.createProduct(productToSave);
//                 return res.status(201).send();
//         }catch(err){
//             console.log(err)
//             return res.status(500).send(err);
//         }
//     }

//     async getAllProducts(req:Request,res:Response){
//         try{
//             let products:Product[] = await this.productService.getAllProducts();
//             let response:any = [];
//             products.forEach((i:any) => {
//                 response.push({
//                 lote: `${i.lote}`,
//                 description: `${i.description}`
//                 });
//             });
//         return res.status(200).send(response);
//         }catch(err){
//             return res.status(500).send(err);
//         } 
//     }

// }
