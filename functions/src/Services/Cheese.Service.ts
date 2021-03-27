import { UpdateCheeseInventory } from "../Models/DTO/Cheese.DTO";
import { Cheese } from "../Models/Entity/Cheese";
import { Packaging } from "../Models/Entity/Packaging";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { CheeseRepository } from "../Repositories/Cheese.Repository";
import { PackagingRepository } from "../Repositories/Packaging.Repository";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { PropertiesPackagingRepository } from "../Repositories/Properties.Packaging.Repository";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";

export class CheeseService{

    private cheeseRepository:CheeseRepository;
    private packagingRepository:PackagingRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private presentationProductsRepository:PresentationsProductsRepository;
    private sqlSRepository:SqlSRepository;
    constructor(){
        this.cheeseRepository=new CheeseRepository();
        this.propertiesPackagingRepository=new PropertiesPackagingRepository();
        this.productRoviandaRepository=new ProductRoviandaRepository();
        this.packagingRepository=new PackagingRepository();
        this.presentationProductsRepository = new PresentationsProductsRepository();
        this.sqlSRepository = new SqlSRepository();
    }

    async createCheese(payload:{code:string}){
        let productRovianda= null;
        productRovianda= await this.productRoviandaRepository.getProductRoviandaByCode(payload.code);
        if(!productRovianda){
            productRovianda =await this.productRoviandaRepository.getProductRoviandaByCodeLike(payload.code);
        }
        if(!productRovianda) throw new Error("[409], no existe un producto con este codigo");
        let cheese:Cheese= await this.cheeseRepository.getCheeseByCode(payload.code);
        if(cheese) throw new Error("[409], El queso ya esta registrado");
        cheese=new Cheese();
        cheese.code=payload.code;
        cheese.description=productRovianda.name;
        cheese.product=productRovianda;
        await this.cheeseRepository.saveCheese(cheese);
    }

    async getCheeseByProductRovianda(product:ProductRovianda){
        return await this.cheeseRepository.getByProductRovianda(product);
    }

    async getAllCheeses(){
        let cheeses:Cheese[] = await this.cheeseRepository.getAllCheeses();
        let response:{code:string,name:string,quantity:number}[]=[];
        for(let cheese of cheeses){
            let packagings:Packaging[] = await this.packagingRepository.getAllPackagingByLotId(cheese.code);
            for(let pack of packagings){
            let packagingProperties:PropertiesPackaging[] = await this.propertiesPackagingRepository.getPropertiesPackagingOfPackaging(pack);
            let count=0;
            for(let proper of packagingProperties){
                count+=proper.units;
            }
            response.push({
                code: cheese.code,
                name: cheese.description,
                quantity: count
            });
            }
        }
        
        return response;
    }

    async updateCheeseCount(updateCheeseInventory:UpdateCheeseInventory){
        let cheese:Cheese = await this.cheeseRepository.getCheeseByCode(updateCheeseInventory.code);
        if(!cheese) throw new Error("[404], no existe el queso a actualizar");
        let packaging:Packaging=null;
            packaging= await this.packagingRepository.getPackagingByLotIdAndPropertiesPackaging(updateCheeseInventory.code);
        if(packaging){
        if(packaging.propertiesPackaging.length){

            let props = packaging.propertiesPackaging[0];
            let presentationProducts = await this.presentationProductsRepository.getPresentationProductByProductRovianda(cheese.product);
            await this.sqlSRepository.updateInventoryGeneralAspeSaeByProduct(presentationProducts.keySae,+updateCheeseInventory.quantity);
            props.units+=+updateCheeseInventory.quantity;
            if(props.active==false) props.active=true;
        }
        }else{
            packaging= new Packaging();
            packaging.active=true;
            packaging.expiration="";
            packaging.lotId=updateCheeseInventory.code;
            packaging.productId=cheese.product;
            let date=new Date();
            date.setHours(date.getHours()-6);
            packaging.registerDate=date.toISOString();
            let propertiesPackaging:PropertiesPackaging = new PropertiesPackaging();
            propertiesPackaging.active=true;
            propertiesPackaging.observations="se guado queso";
            propertiesPackaging.packaging=packaging;
            propertiesPackaging.units=+updateCheeseInventory.quantity;
            propertiesPackaging.weight=+updateCheeseInventory.quantity;
            let presentationProducts = await this.presentationProductsRepository.getPresentationProductByProductRovianda(cheese.product);
            propertiesPackaging.presentation=presentationProducts;
            packaging.propertiesPackaging=new Array();
            await this.sqlSRepository.updateInventoryGeneralAspeSaeByProduct(presentationProducts.keySae,+updateCheeseInventory.quantity);
            packaging.propertiesPackaging.push(propertiesPackaging);
        }
        await this.packagingRepository.savePackaging(packaging);
    }

}