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
import { CheeseService } from "./Cheese.Service";
import { Cheese } from "../Models/Entity/Cheese";


export class ProductRoviandaService{
    private productRoviandaRepository:ProductRoviandaRepository;
    private productRepository:ProductRepository;
    private presentationsProductsRepository:PresentationsProductsRepository;
    private sqlsRepository:SqlSRepository;
    private cheeseService:CheeseService;
    constructor(private firebaseHelper: FirebaseHelper){
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.presentationsProductsRepository= new PresentationsProductsRepository();
        this.sqlsRepository = new SqlSRepository();
        this.cheeseService=new CheeseService();
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
            if(productRoviandaDTO.presentations[i].codePresentation!=null){
                presentationProduct.keySae=productRoviandaDTO.presentations[i].codePresentation;
            }else{
            presentationProduct.keySae = (productRoviandaDTO.keyProduct+""+(i+1).toString());
            }
            productRovianda.presentationProducts.push(presentationProduct);
            
        }    
        await this.productRoviandaRepository.saveProductRovianda(productRovianda);
        if(productRoviandaDTO.distLine=="CHEESE_LINE"){
            await this.cheeseService.createCheese({code:productRoviandaDTO.keyProduct});
        }
}

    async getProductsRoviandaByRoviandaId(req: Request) {
        let id = req.params.roviandaId;

        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+id);
        if (!productRovianda)  throw new Error(`[400], Product rovianda with id ${id} was not found`);
        
        let response = {};

        let ingredients = await this.productRepository.getIngredientsByProduct(productRovianda.id);
        let presentations = await this.presentationsProductsRepository.getPresentatiosProductsByProductRovianda(productRovianda.id);
        let descrLin:string="";
        let linesArray = await this.sqlsRepository.getProductLinePresentation(presentations[0].keySae);
        if(linesArray.length){
        let lineDescrip = await this.sqlsRepository.getProductLineSaeByKey(linesArray[0].LIN_PROD);
        if(lineDescrip.length){
            descrLin=lineDescrip[0].DESC_LIN;
        }
        }
        let cheese:Cheese =await this.cheeseService.getCheeseByProductRovianda(productRovianda);
        let distLine:string="NORMAL";
        if(cheese){
            distLine="CHEESE_LINE";
        }
        response = {
            code: productRovianda.code ? productRovianda.code : null,
            nameProduct: productRovianda.name ? productRovianda.name : null,
            distLine,
            status: productRovianda.status ? productRovianda.status : null,
            image: productRovianda.imgS3,
            ingredents: ingredients,
            presentations: presentations,
            lineProduct:descrLin
          }
        return response;
    }
  
    async updateProductRovianda(productRoviandaDTO:UpdateProductRoviandaDTO,productId: number) {
    
        if(!productRoviandaDTO.nameProduct) throw new Error("[400],nameProduct is required");
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        if(!productRovianda) throw new Error(`[404],product_rovianda with id ${productId} not found`);
        productRovianda.name = productRoviandaDTO.nameProduct;
        if(productRoviandaDTO.image!=null){
            await this.firebaseHelper.deleteImagen(productRovianda.imgS3.split(".appspot.com/")[1]);
            let urlOfImage: string = await this.firebaseHelper.uploadImage(`${productRovianda.code}/`, new Buffer(productRoviandaDTO.image,'base64'));
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
        if (productRoviandaDTO.presentations.length){
            let presentationModified = productRoviandaDTO.presentations.filter(x=>x.presentationId!=null);
            let productLinePresentation:string=null;
            for(let presentationModify of presentationModified){
                let presentation:PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(presentationModify.presentationId);
                if(presentation.presentation!=presentationModify.presentation){
                    presentation.presentation = presentationModify.presentation;
                }
                if(presentation.presentationType!=presentationModify.typePresentation){
                    presentation.presentationType=presentationModify.typePresentation;
                }
                if(presentation.presentationPricePublic!=presentationModify.pricePresentation){
                    presentation.presentationPricePublic=presentationModify.pricePresentation;
                }
                if(productLinePresentation==null){
                    productLinePresentation=presentation.keySae;
                }
                await this.sqlsRepository.updateProductSaeProperties(presentation.keySae,productRovianda.name,presentationModify);
                await this.presentationsProductsRepository.savePresentationsProduct(presentation);
            }
            if(productLinePresentation==null){
                productLinePresentation=productRovianda.presentationProducts[0].keySae;
            }
            let productLineQuery = await this.sqlsRepository.getProductLinePresentation(productLinePresentation);
            if(!productLineQuery.length) throw new Error("[409], no existe linea de producto para esta linea de productos");
            let productLineStr = productLineQuery[0].LIN_PROD;
            let presentationsAdded=productRoviandaDTO.presentations.filter(x=>x.presentationId==null);
            
            for(let i=0;i< presentationsAdded.length;i++){
                let presentation = presentationsAdded[i];
                if(!presentation.presentation) throw new Error("[400],presentation is required");
                if(!presentation.pricePresentation) throw new Error("[400],pricePresentationPublic is required");
                if(!presentation.typePresentation) throw new Error("[400],typePresentation is required");
                if(!presentation.taxSchema) throw new Error("[400],taxSchema is required");
                if(!presentation.warehouseKey) throw new Error("[400],warehouseKey is required");
                let presentationProduct:PresentationProducts = new PresentationProducts();
                    presentationProduct.presentation = presentation.presentation;
                    presentationProduct.presentationPricePublic = presentation.pricePresentation;
                    presentationProduct.presentationPriceMin = 0;//presentation.pricePresentationMin;
                    presentationProduct.presentationPriceLiquidation = 0;//presentation.pricePresentationLiquidation;
                    presentationProduct.presentationType = presentation.typePresentation;
                    presentationProduct.productRovianda = productRovianda;
                    productRovianda.presentationProducts.push(presentationProduct);
                    presentationProduct.keySae=(productRovianda.presentationProducts.length+(i+1)).toString();
                    await this.sqlsRepository.addPresentationProductSae(productRovianda.code,productLineStr,(productRovianda.presentationProducts.length+(i+1)).toString(),productRovianda.name,productRoviandaDTO.presentations[i]);
            }
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
      let presentations2:Array<any>=[];
      for(let presentationEntity of presentations){
        let productSae = await this.sqlsRepository.getProductSaeByKey(presentationEntity.keySae);
        let presentation:any={};
        //let claveEsq = +productSae[0].CVE_ESQIMPU;
      /*switch(claveEsq){
        
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
      }*/
      console.log("PRESENTATION ENTITY",presentationEntity);
      console.log("PRODUCT SAE",productSae[0]);
      let uniMed:string= (productSae[0].UNI_MED as string).toLowerCase();
      presentation={...presentationEntity};
        if(uniMed=="kg"){
          presentation.isPz=false;
          
          let hasKg=(presentation.presentationType as string).toLowerCase().includes("kg");
          let kagNumber =0;
          if(hasKg){
            let kgNumber:string =((presentation.presentationType.split('(')[1]).split(')')[0]).toLowerCase();
            kgNumber=kgNumber.slice(0,kgNumber.indexOf('kg'));
            kagNumber =  +kgNumber;
            presentation.presentationPricePublic=presentation.presentationPricePublic*kagNumber;
          }
          
        }else if(uniMed=="pz"){
          presentation.isPz=true;
        }
        presentations2.push(presentation);
    }
        return presentations2;
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