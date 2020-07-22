import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { ProductRoviandaDTO } from "../Models/DTO/ProductRoviandaDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Request, response } from "express";
import { PresentationsProductsRepository }  from '../Repositories/Presentation.Products.Repository';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';

export class ProductRoviandaService{
    private productRoviandaRepository:ProductRoviandaRepository;
    private productRepository:ProductRepository;
    private presentationsProductsRepository:PresentationsProductsRepository;
    constructor(){
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.presentationsProductsRepository= new PresentationsProductsRepository();
    }


    async saveProductRovianda(productRoviandaDTO:ProductRoviandaDTO){
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByName(productRoviandaDTO.name);
        if(product) throw new Error("[409], Ya existe un producto con ese nombre");
        let ingredients:Array<Product>=[];
        for(let ingredient of productRoviandaDTO.ingredients){
            let productIngredient:Product = await this.productRepository.getProductById(ingredient);
            if(!productIngredient) throw new Error("[404], no existe el producto con el id: "+ingredient);
            ingredients.push(productIngredient);
        }

        let productRovianda:ProductRovianda = new ProductRovianda();
        productRovianda.name = productRoviandaDTO.name;
        productRovianda.ingredients = ingredients;
        console.log("Producto rovianda",JSON.stringify(productRovianda));
        await this.productRoviandaRepository.saveProductRovianda(productRovianda);
    }

    async getProductRovianda(req:Request){
        let productRoviandaId:number = +req.params.productId;
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByIdss(productRoviandaId);
        if(!productRovianda) throw new Error("[404],el produto no existe");
        console.log(productRovianda)
        let response = {};
        let ingredent = []
        productRovianda.ingredients.forEach(i =>{
            ingredent.push({
                productId: i.id,
                description: i.description
            })
        })
        response = {
            id: productRovianda.id,
            name: productRovianda.name,
            ingredients: ingredent
        }
        return response;
    }

    async deleteProductRovianda(req:Request){
        let productRoviandaId:number = +req.params.productId;
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productRoviandaId);
        if(!productRovianda) throw new Error("[404],el produto no existe");
        await this.productRoviandaRepository.deleteProductRoviandaById(productRoviandaId);
    }

    async getAllProductsRovianda(){
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getProductoRoviandaById(productId:number){
        return await this.productRoviandaRepository.getProductRoviandaById(productId);
    }

    async getProductsPresentationByRoviandaId(req: Request) {
        let id = req.params.productRoviandaId;
        let productRovianda = await this.productRoviandaRepository.getProductRoviandaById(+id);

        console.log(productRovianda);
        if (!productRovianda)
            throw new Error(`[400], Product rovianda with id ${id} was not found`);
        
        let response = productRovianda.presentationProducts.map(presentationProduct=>{
            return {
                presentationId: presentationProduct.id,
                presentation: presentationProduct.presentation,
                typePresentation: presentationProduct.presentationType
            }
        });

        return response;
    }

    async getAllProductRoviandaState(){
        let productRovianda:ProductRovianda[] = await this.productRoviandaRepository.getAllProducts();
        let response:any = []
        productRovianda.forEach(i=>{
            if((i.status)){
                response.push({
                    id: i.id,
                    code: i.code,
                    productName: i.name
                });
            }
        });
        return response;
    }

    async deleteProductRoviandaLogic(roviandaId:number){
        if(!roviandaId) throw new Error("[400],roviandaId is required");
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByProductId(roviandaId);
        if(!productRovianda) throw new Error("[404],productRovianda not found");
        if(!productRovianda.status) throw new Error("[404],productRovianda is deleted");
        productRovianda.status = false;
        return await this.productRoviandaRepository.saveProductRovianda(productRovianda);
    }

    async deletePresentation(presentationId:number){
        if(!presentationId) throw new Error("[400],presentationId is required");
        let presentation:PresentationProducts = await this.presentationsProductsRepository.getPresentatiosProductsById(presentationId);
        if(!presentation) throw new Error("[404],Presentation not found");
        if(!presentation.status) throw new Error("[404],Presentation is deleted");
        presentation.status = false;
        return await this.presentationsProductsRepository.createPresentation(presentation);
    }
}