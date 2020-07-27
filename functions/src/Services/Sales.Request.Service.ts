import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SalesRequest } from '../Models/Entity/Sales.Request';
import { Request } from "express";
import { SalesProductDTO } from '../Models/DTO/Sales.ProductDTO';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { SaleSeller } from '../Models/Entity/Sale.Seller';
import { SalesSellerRepository } from '../Repositories/SaleSeller.Repository';



export class SalesRequestService{
    private salesRequestRepository:SalesRequestRepository;
    private userRepository:UserRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private presentationProductsRepository:PresentationsProductsRepository;
    private saleSellerRepository:SalesSellerRepository;
    constructor(){
        this.salesRequestRepository = new SalesRequestRepository();
        this.userRepository = new UserRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.presentationProductsRepository = new PresentationsProductsRepository();
        this.saleSellerRepository = new SalesSellerRepository();
    }
    
    async getSales(){

      let sales_request : SalesRequest[] = await this.salesRequestRepository.getSalesRequest();
      
      let response = [];
        sales_request.forEach(i => {
          response.push({
            userId: `${i.userId}`,
            noOrder: `${i.requestId}`,
            vendedor: `${i.vendedor}`,  
          });
        });
      return response;
    }

    async saveSalesProduct(salesProductDTO:SalesProductDTO){

      if(!salesProductDTO.userId)throw new Error("[400],userId is required");
      if(salesProductDTO.urgent == null )throw new Error("[400],urgent is required");
      let user:User = await this.userRepository.getUserById(salesProductDTO.userId);
      if(!user)throw new Error(`[404],user with id ${salesProductDTO.userId} not found`);

      let date = `${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}`;

      let saleSeller : SaleSeller = new SaleSeller();
      saleSeller.date = date;
      saleSeller.status = true;
      saleSeller.urgent = salesProductDTO.urgent;
      saleSeller.user = user;
      await this.saleSellerRepository.saveSalesSeller(saleSeller);

      let lastSaleSeller: SaleSeller= await this.saleSellerRepository.getLastSaleSeller();
  
        for(let i = 0; i<salesProductDTO.requestedProducts.length; i++){
          if(!salesProductDTO.requestedProducts[i].productId)throw new Error("[400],productId is required");
          if(!salesProductDTO.requestedProducts[i].presentationId)throw new Error("[400],productId is required");
          if(!salesProductDTO.requestedProducts[i].units)throw new Error("[400],productId is required");
          let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByIds(+salesProductDTO.requestedProducts[i].productId);
          if(!product)throw new Error(`[404],productId ${salesProductDTO.requestedProducts[i].productId} not found`);
          if(!product.packaging[0])throw new Error(`[404], product with id ${salesProductDTO.requestedProducts[i].productId} no exist in packaging`);
          let presentation:PresentationProducts = await this.presentationProductsRepository.getPresentatiosProductsById(+salesProductDTO.requestedProducts[i].presentationId);
          if(!presentation)throw new Error(`[404],presentationId ${salesProductDTO.requestedProducts[i].presentationId} not found`); 

          let saleProduct:SalesRequest = new SalesRequest();
            saleProduct.date = date;
            saleProduct.status = true; 
            saleProduct.productId = product.id;
            saleProduct.presentation = presentation;
            saleProduct.units = salesProductDTO.requestedProducts[i].units;
            saleProduct.saleSeller = lastSaleSeller;
            await this.salesRequestRepository.saveSalesProduct(saleProduct);
        }
    }

  }











