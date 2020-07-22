import { ProductRepository } from "../Repositories/Product.Repository";
import { Product } from "../Models/Entity/Product";
import { Request, response } from "express";
import { TYPE } from "../Models/Enum/Type.Lot";
import { IngredentDTO } from "../Models/DTO/IngredentDTO";
import { IngredentStatus } from "../Models/Enum/IngredentStatus";

export class ProductService{
    private productRepository:ProductRepository;
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(type:string){

        if(type==TYPE.DRIEF )
            return await this.productRepository.getAllProductsDrief(TYPE.DRIEF);
        
        if(type == TYPE.PACKING){
            return await this.productRepository.getAllProductsPacking(TYPE.PACKING);
        }else{
            throw new Error("[400], type parameter has a invalid value")
        }
    }

    async createProduct(req:Request){
        let {description,type} = req.body;
        if(!type) throw new Error("[400],type is required");
        if (!description) throw new Error('[400],description is required');
        if(type == TYPE.DRIEF || type == TYPE.PACKING || type == TYPE.FRIDGE){
            let objProdcuts:Product = await this.productRepository.getProductByDescription(description);
            if(!objProdcuts){
                let productToSave = new Product();   
                console.log("inicio")
                productToSave.description = description;
                //productToSave.type = type;
                console.log("creando")
                return await this.productRepository.createProduct(productToSave);
            }else{
                throw new Error('[409],There is already a product with that name');
            }
        }else{
            throw new Error("[400],type Invalid");
        } 
    }

    async getProductById(productId:number){
        return await this.productRepository.getProductById(productId);
    }

    async getProductsByLotId(lotId:number){
        return await this.productRepository.getProductsByLotId(lotId)
    }

    async addIngredent(ingredent:IngredentDTO){
        if(!ingredent.nameProduct) throw new Error("[400],nameProduct is required");
        if(!ingredent.mark) throw new Error("[400],mark is required");
        if(!ingredent.variant) throw new Error("[400],variant is required");
        if(!ingredent.presentation) throw new Error("[400],presentation is required");
        if(!ingredent.category) throw new Error("[400],category is required");
        if(ingredent.category == IngredentStatus.DRIEF || ingredent.category == IngredentStatus.PACKGING){
            let saveIngredent:Product = new Product();
            saveIngredent.description = ingredent.nameProduct;
            saveIngredent.mark = ingredent.mark;
            saveIngredent.variant = ingredent.variant;
            saveIngredent.presentation = ingredent.presentation;
            saveIngredent.category = ingredent.category;
            saveIngredent.state = true;
            return await this.productRepository.createProduct(saveIngredent);
        }else{
            throw new Error("[400],category incorrect");
        }
    }

    async getAllIngredents(type:string){
        if(!type) throw new Error("[400],type is required");
        let response:any = [];
        if(type == IngredentStatus.DRIEF || type == IngredentStatus.PACKGING){
            let ingredents:Product[] = await this.productRepository.getAllIngredents(type);
            ingredents.forEach( i=> {
                if(i.state){
                    response.push({
                        id: i.id,
                        nameProduct: i.description,
                        mark: i.mark,
                        variant: i.variant,
                        presentation: i.presentation,
                        category: i.category
                    });
                }
            });
        }else{
            throw new Error("[400],type incorrect");
        }
        return response;
    }

    async deleteIngredent(ingredentId:number){
        if(!ingredentId) throw new Error("[400],type is required");
        let ingredent:Product = await this.productRepository.getProductById(ingredentId);
        if(!ingredent) throw new Error("[404],Ingredent not found");
        if(!ingredent.state) throw new Error("[404],Ingredent is deleted");
        ingredent.state = false;
        return await this.productRepository.createProduct(ingredent);
    }
}

