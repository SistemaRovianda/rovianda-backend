import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { FileInterface, ProductLineSaeForm, ProductRoviandaDTO, SaveProductRoviandaDTO, UpdateProductRoviandaDTO } from "../Models/DTO/ProductRoviandaDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Product } from '../Models/Entity/Product';
import { ProductRepository } from "../Repositories/Product.Repository";
import { Request, response } from "express";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { PresentationsProductsRepository }  from '../Repositories/Presentation.Products.Repository';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { validateProductLineSae } from "../Utils/Validators/Product.Rovianda.Vlidator";


export class ProductRoviandaService{
    private productRoviandaRepository:ProductRoviandaRepository;
    private productRepository:ProductRepository;
    private presentationsProductsRepository:PresentationsProductsRepository;
    private sqlsRepository:SqlSRepository;
    constructor(private firebaseHelper: FirebaseHelper){
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.presentationsProductsRepository= new PresentationsProductsRepository();
        this.sqlsRepository = new SqlSRepository();
    }


    async saveProductRovianda(productRoviandaDTO:ProductRoviandaDTO){
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByName(productRoviandaDTO.name);
        if(product){
            if(product.status == false){
                product.status = true;
                return await this.productRoviandaRepository.saveProductRovianda(product);
            }else{
                throw new Error("[409], Ya existe un producto con ese nombre");
            }
        }else{
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
            return await this.productRoviandaRepository.saveProductRovianda(productRovianda);
        }
    }

    async getProductRovianda(req:Request){
        let productRoviandaId:number = +req.params.productId;
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByIdss(productRoviandaId);
        if(!productRovianda) throw new Error("[404],el produto no existe");
        console.log(productRovianda)
        let response = {};
        let ingredent = []
        ingredent= productRovianda.ingredients.map(i =>{
            return {
                productId: i.id,
                description: i.description
            }
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
        await this.sqlsRepository.deleteProductRovianda(productRovianda);
        await this.firebaseHelper.deleteImagen(productRovianda.imgS3);
        await this.productRoviandaRepository.deleteProductRoviandaById(productRoviandaId);
    }

    async getAllProductsRovianda(){
        return await this.productRoviandaRepository.getAllProductsT();
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
        let presentation:PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(presentationId);
        if(!presentation) throw new Error("[404],Presentation not found");
        if(!presentation.status) throw new Error("[404],Presentation is deleted");
        presentation.status = false;
        return await this.presentationsProductsRepository.createPresentation(presentation);
    }

    async createProductRovianda(productRoviandaDTO:SaveProductRoviandaDTO){
     
        if(!productRoviandaDTO.keyProduct) throw new Error("[400],keyProduct is required");
        if(!productRoviandaDTO.nameProduct) throw new Error("[400],nameProduct is required");
        //if(!productRoviandaDTO.ingredients[) throw new Error("[400],ingredients is required");
        if(!productRoviandaDTO.presentations.length) throw new Error("[400],presentations is required");
        
        let lineProduct = await this.sqlsRepository.getProductLineSaeByKey(productRoviandaDTO.productLine);
        
        if(!lineProduct.length) throw new Error("[409], No existe la linea de producto: "+productRoviandaDTO.productLine);
        
        for(let i=0;i<productRoviandaDTO.presentations.length;i++){
        let presentation = productRoviandaDTO.presentations[i];
        presentation.warehouseKey=1;
        let productSae = await this.sqlsRepository.getProductSaeByKey(productRoviandaDTO.keyProduct+(i+1));
        if(productSae.length) throw new Error("[409], ya existe un producto con la clave: "+productRoviandaDTO.keyProduct);
         //let warehouseSae = await this.sqlsRepository.getWarehouseByKey(presentation.warehouseKey);
         //if(!warehouseSae.recordset.length) throw new Error("[404], no existe el almacen con la clave: "+presentation.warehouseKey);
         }

        await this.sqlsRepository.saveProductRovianda(productRoviandaDTO);

        let urlOfImage: string = await this.firebaseHelper.uploadImage(`${productRoviandaDTO.keyProduct}/`, new Buffer(productRoviandaDTO.productRoviandaImage,'base64'));
        
        let productRovianda:ProductRovianda = new ProductRovianda();
        productRovianda.code = productRoviandaDTO.keyProduct;
        productRovianda.name = productRoviandaDTO.nameProduct;
        productRovianda.status = true;
        productRovianda.imgS3 = urlOfImage;
        productRovianda.ingredients = new Array<Product>(); 
        productRovianda.presentationProducts = new Array<PresentationProducts>();
        
        for (let ingredient of productRoviandaDTO.ingredients) {
            if(!ingredient.productId) throw new Error("[400],productId is required");
            if(!ingredient.nameProduct) throw new Error("[400],nameProduct is required");
            let productIngredient:Product = await this.productRepository.getProductById(ingredient.productId);
            if(!productIngredient) throw new Error(`[404], product ingredent with id ${ingredient.productId} not found`);
                productRovianda.ingredients.push(productIngredient);  
            }

        for (let i = 0; i < productRoviandaDTO.presentations.length; i++) {
            if(!productRoviandaDTO.presentations[i].presentation) throw new Error("[400],presentation is required");
            if(!productRoviandaDTO.presentations[i].pricePresentation) throw new Error("[400],pricePresentation is required");
            if(!productRoviandaDTO.presentations[i].typePresentation) throw new Error("[400],typePresentation is required");
            let presentationProduct:PresentationProducts = new PresentationProducts();
            presentationProduct.presentation = productRoviandaDTO.presentations[i].presentation;
            presentationProduct.presentationPricePublic = productRoviandaDTO.presentations[i].pricePresentation;//presentations[i].pricePresentationPublic;
            presentationProduct.presentationPriceMin = 0;//presentations[i].pricePresentationMin;
            presentationProduct.presentationPriceLiquidation =0;// presentations[i].pricePresentationLiquidation;
            presentationProduct.presentationType = productRoviandaDTO.presentations[i].typePresentation;
            presentationProduct.productRovianda = productRovianda;
            presentationProduct.typePrice = "PUBLICO";
            presentationProduct.status = true;
            presentationProduct.keySae = (productRoviandaDTO.keyProduct+""+(i+1).toString());
            productRovianda.presentationProducts.push(presentationProduct);
        }    
        await this.productRoviandaRepository.saveProductRovianda(productRovianda);
        
}

    async getProductsRoviandaByRoviandaId(req: Request) {
        let id = req.params.roviandaId;

        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+id);
        if (!productRovianda)  throw new Error(`[400], Product rovianda with id ${id} was not found`);
        
        let response = {};

        let ingredients = await this.productRepository.getIngredientsByProduct(productRovianda.id);
        let presentations = await this.presentationsProductsRepository.getPresentatiosProductsByProductRovianda(productRovianda.id);

        response = {
            code: productRovianda.code ? productRovianda.code : null,
            nameProduct: productRovianda.name ? productRovianda.name : null,
            status: productRovianda.status ? productRovianda.status : null,
            image: productRovianda.imgS3,
            ingredents: ingredients,
            presentations: presentations
          }
        return response;
    }
  
    async updateProductRovianda(productRoviandaDTO:UpdateProductRoviandaDTO,productId: number,imageProduct:any) {
    
        if(!productRoviandaDTO.nameProduct) throw new Error("[400],nameProduct is required");
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        if(!productRovianda) throw new Error(`[404],product_rovianda with id ${productId} not found`);
        let productSae= await this.sqlsRepository.getProductSaeByKey(productRovianda.code);
        if(!productSae.length) throw new Error("[404], no existe ese producto registrado en SAE");
        productRovianda.name = productRoviandaDTO.nameProduct;
        if(imageProduct!=null){
            await this.firebaseHelper.deleteImagen(productRovianda.imgS3);
            let photo = imageProduct;
            let urlOfImage: string = await this.firebaseHelper.uploadImage(`${productRovianda.code}/`, photo.buffer);
            productRovianda.imgS3 = urlOfImage;
        }
        await this.productRoviandaRepository.saveProductRovianda(productRovianda);
        
        if (productRoviandaDTO.ingredients.length)
            for(let ingredent of productRovianda.ingredients){
                await this.productRepository.deleteIngredientById(productRovianda.id,ingredent.id);
            }  
            productRovianda.ingredients = new Array<Product>();  
            for (let i = 0; i < productRoviandaDTO.ingredients.length; i++) {
                if(!productRoviandaDTO.ingredients[i].productId) throw new Error("[400],ingredientId is required");
                if(!productRoviandaDTO.ingredients[i].nameProduct) throw new Error("[400],Presentation is required");

                let productIngredient:Product = await this.productRepository.getProductById(productRoviandaDTO.ingredients[i].productId);
                if(!productIngredient) throw new Error(`[404], product ingredent with id ${productRoviandaDTO.ingredients[i].productId} not found`);
                productRovianda.ingredients.push(productIngredient);
                }
            await this.productRoviandaRepository.saveProductRovianda(productRovianda);
        if (productRoviandaDTO.presentations.length)
            for(let presentation of productRovianda.presentationProducts){
                await this.presentationsProductsRepository.deleteById(presentation.id);
            }
            for (let presentation of productRoviandaDTO.presentations) {
                if(!presentation.presentation) throw new Error("[400],presentation is required");
                if(!presentation.pricePresentation) throw new Error("[400],pricePresentationPublic is required");
                //if(!presentation.pricePresentationMin) throw new Error("[400],pricePresentationMin is required");
                //if(!presentation.pricePresentationLiquidation) throw new Error("[400],pricePresentationLiquidation is required");
                if(!presentation.typePresentation) throw new Error("[400],typePresentation is required");
                let presentationProduct:PresentationProducts = new PresentationProducts();
                    presentationProduct.presentation = presentation.presentation;
                    presentationProduct.presentationPricePublic = presentation.pricePresentation;
                    presentationProduct.presentationPriceMin = 0;//presentation.pricePresentationMin;
                    presentationProduct.presentationPriceLiquidation = 0;//presentation.pricePresentationLiquidation;
                    presentationProduct.presentationType = presentation.typePresentation;
                    presentationProduct.productRovianda = productRovianda;
                    productRovianda.presentationProducts.push(presentationProduct);
                    await this.productRoviandaRepository.saveProductRovianda(productRovianda);
            }        
    }   

    async getProductsRoviandaByCode(req: Request) {
        let code = req.query.code;
    
        let productsRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByCode(code);
        if (!productsRovianda)  throw new Error(`[400], Product rovianda with code :${code} was not found`);
            
        let response = [];

        
            let presentations = await this.presentationsProductsRepository.getPresentatiosProductsByProductRovianda(productsRovianda.id);
                response.push({
                    code: productsRovianda.code,
                    nameProduct: productsRovianda.name ,
                    presentations: presentations
                });
        
            return response;
    }

    async getById(productId:number){
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByProductId(productId);
        return product;
    }

    async getProductsPresentation(productId:number){
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getByIdWithPresentations(productId);
        
        if(!productRovianda) throw new Error("[400], producto no existente en SAE");
      
      let presentations:Array<PresentationProducts> = productRovianda.presentationProducts;
      
      for(let presentation of presentations){
        let productSae = await this.sqlsRepository.getProductSaeByKey(presentation.keySae);
        let claveEsq = +productSae[0].CVE_ESQIMPU;
      switch(claveEsq){
        
        case 1:
          presentation.presentationPricePublic +=(presentation.presentationPricePublic*.16);
          presentation.presentationPriceMin +=(presentation.presentationPriceMin*.16);
          presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.16);
          break;
          case 2: // sin IVA operaciones no necesarias
            break;
            case 3: // IVA EXCENTO
              break;
              case 4: // 16 IVA mas 8% de IEPS
                presentation.presentationPricePublic += (presentation.presentationPricePublic*.16);
                presentation.presentationPricePublic += (presentation.presentationPricePublic*.08)
                presentation.presentationPriceMin += (presentation.presentationPriceMin*.16);
                presentation.presentationPriceMin += (presentation.presentationPriceMin*.08)
                presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.16);
                presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.08)
                break;
                case 5:// 16 IVA mas 25% de IEPS
                presentation.presentationPricePublic += (presentation.presentationPricePublic*.16);
                presentation.presentationPricePublic += (presentation.presentationPricePublic*.25)
                presentation.presentationPriceMin += (presentation.presentationPriceMin*.16);
                presentation.presentationPriceMin += (presentation.presentationPriceMin*.25)
                presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.16);
                presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.25)
                  break;
                  case 6:// 16 IVA mas 50% de IEPS
                      presentation.presentationPricePublic += (presentation.presentationPricePublic*.16);
                      presentation.presentationPricePublic += (presentation.presentationPricePublic*.50)
                      presentation.presentationPriceMin += (presentation.presentationPriceMin*.16);
                      presentation.presentationPriceMin += (presentation.presentationPriceMin*.50)
                      presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.16);
                      presentation.presentationPriceLiquidation += (presentation.presentationPriceLiquidation*.50)
                    break;
      }
    }
        return presentations;
    }

    async getAllproductsRoviandaCatalog(){
        return await this.productRoviandaRepository.getAllProductRoviandaCatalog();
    }



    async getLinesOfProductsSae(){
        return await this.sqlsRepository.getLinesOfProductsSae();
    }

    async createProductLineSae(productLineSaeForm:ProductLineSaeForm){
        validateProductLineSae(productLineSaeForm);
        let record = await this.sqlsRepository.getProductLineSaeByKey(productLineSaeForm.clave);
        if(record.length) throw new Error("[409], ya existe una linea de producto con ese nombre");
        return await this.sqlsRepository.saveProductLineSae(productLineSaeForm);
    }

    async getAllProductLines(){
        return await this.sqlsRepository.getLinesOfProductsSae();
    }
}