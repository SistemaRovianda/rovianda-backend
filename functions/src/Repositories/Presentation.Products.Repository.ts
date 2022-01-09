import {connect} from '../Config/Db';
import { Like, Repository } from 'typeorm';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import {  DayMetricProps, PresentationMetrics, QueryCharMetricWeekResult } from '../Models/DTO/Quality.DTO';
export class PresentationsProductsRepository{
    private presentationsProductsRepository:Repository<PresentationProducts>;

    async getConnection(){
        if(!this.presentationsProductsRepository){
            this.presentationsProductsRepository = (await connect()).getRepository(PresentationProducts);
        }
    }

    async getPresentationProductByProductRovianda(productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({
            productRovianda
        });
    }

    async getPresentationProductsById(presentationId:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({id:presentationId},{relations:["productRovianda"]});
    }
  
    async savePresentationsProduct(presentation:PresentationProducts){
        await this.getConnection();
        return await this.presentationsProductsRepository.save(presentation);
    }

    async getLastProductPresentation(){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({
            order: {
                id: 'DESC'
                }
        });
    }

    async getAllPresentations(){
        await this.getConnection();
        return await this.presentationsProductsRepository.find({where:{status:1},relations:["productRovianda"]});
    }

    async savePresentationsProducts(presentation:number,product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`INSERT INTO products_rovianda_presentation (presentation_id ,product_id) VALUES (${presentation},${product})`)
    }

    async getPresentationsProducts(presentation:number,product:number){
        await this.getConnection();
        console.log("consulta")
        return await this.presentationsProductsRepository.query(`
        SELECT * FROM products_rovianda_presentation 
        WHERE presentation_id = ${presentation} 
        AND product_id = ${product}
        `)
    }

    async createPresentation(presentation:PresentationProducts){
        await this.getConnection();
        return await this.presentationsProductsRepository.save(presentation);
    }

    async getPresentatiosProductsByProductRovianda(product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select 
        presentation_products.presentation_id as presentationId,
        presentation_products.presentation,
        presentation_products.type_presentation as typePresentation,presentation_products.key_sae as keySae,
        presentation_products.price_presentation_public as pricePresentationPublic,
        presentation_products.price_presentation_min as pricePresentationMin,
        presentation_products.price_presentation_liquidation as pricePresentationLiquidation
        from presentation_products where product_rovianda_id=${product}
        `)
    }

    async belongToProduct(product:number,presentation:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select * from products_rovianda_presentation
        where products_rovianda_presentation.presentation_id = ${presentation} and products_rovianda_presentation.product_id = ${product}`)
    }

    async deleteById(presentationProductId:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.delete({id:presentationProductId});
    }

    async findByKeySae(presentationKey:string){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({keySae:presentationKey},{relations:["productRovianda"]});
    }
    async findByKeySaeByLike(presentationKey:string){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({keySae:Like(`%${presentationKey}`)},{relations:["productRovianda"]});
    }

    async getAllPresentationActiveProductsByProduct(productId:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.find({where:{productRovianda:{id:productId},status:1}});
    }

    async getPresentationsMetricsByProductId(productId:number,date1:string,date2:string,date3:string,date4){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`   
        select t3.t1PresentationId as presentationId,t3.t1Presentation as presentation,t3.t1Quantity,t3.t1Amount,t3.t2Quantity,t3.t2Amount,
                    if(t3.t1Quantity=0 and t3.t2Quantity=0,0,if(t3.t1Quantity=0,100,if(t3.t2Quantity=0,-100, if(t3.t1Quantity>t3.t2Quantity, round(-100+((t3.t2Quantity*100)/t3.t1Quantity),2) ,round( (((t3.t2Quantity-t3.t1Quantity)*100)/t3.t1Quantity) ,2) ) )  )  ) as increase
                    from (select t1.t1PresentationId,t1.t1Presentation,t1.t1Quantity,t1.t1Amount,t2.t2Quantity,t2.t2Amount from (
						select sub.presentation_id as t1PresentationId,pp.type_presentation as t1Presentation,round(sum(sub.quantity),2) as t1Quantity ,
                        round(sum(sub.amount),2) as t1Amount
						from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id left join presentation_products as pp on sub.presentation_id=pp.presentation_id
						where sub.product_id =${productId} and sa.date between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z"
						group by sub.presentation_id
                        union
						select pp.presentation_id as t1PresentationId,pp.type_presentation as t1Presentation,0 as t1Quantity,0 as t1Amount
						from  presentation_products as pp
						where pp.product_rovianda_id =${productId} and pp.presentation_id  not  in(
						select sub.presentation_id from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
						left join presentation_products as pp on sub.presentation_id=pp.presentation_id
						where sub.product_id =${productId} and sa.date between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z"
						group by sub.presentation_id
						) 
			 ) as t1 
                    left join ( 
						select sub.presentation_id as t2PresentationId,pp.type_presentation as t2Presentation,round(sum(sub.quantity),2) as t2Quantity ,
                        round(sum(sub.amount),2) as t2Amount
						from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id left join presentation_products as pp on sub.presentation_id=pp.presentation_id
						where sub.product_id =${productId} and sa.date between "${date3}T00:00:00.000Z" and "${date4}T23:59:59.000Z"
						group by sub.presentation_id
					union
						select pp.presentation_id as t2PresentationId,pp.type_presentation as t2Presentation,0 as t2Quantity,0 as t2Amount 
						from  presentation_products as pp
						where pp.product_rovianda_id =${productId} and pp.presentation_id  not  in(
							select sub.presentation_id from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
							left join presentation_products as pp on sub.presentation_id=pp.presentation_id
							where sub.product_id =${productId} and sa.date between "${date3}T00:00:00.000Z" and "${date4}T23:59:59.000Z"
							group by sub.presentation_id
							) 
						) as t2 on t1.t1PresentationId=t2.t2PresentationId ) as t3;
        `) as PresentationMetrics[];
    }

    async getChartDataByWeek(presentationId:number,date1:string,date2:string,date3:string,date4:string){
        await this.getConnection();
        let days:DayMetricProps[] = [
            {
                label: "Lunes",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label: "Martes",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label:"Miercoles",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label:"Jueves",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label: "Viernes",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label: "Sabado",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            },
            {
                label: "Domingo",
                amountOld:0,
                amountNew:0,
                quantityOld:0,
                quantityNew:0
            }
        ]
        
        let lastData = await this.presentationsProductsRepository.query(`
        select round(sum(sub.amount),2) as amount1,round(sum(sub.quantity),2) as quantity1,dayofweek(sa.date) as day from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
        where sub.presentation_id=${presentationId} and
        sa.date between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z"
        group by dayofweek(sa.date)
        `) as QueryCharMetricWeekResult[];
        let currentData = await this.presentationsProductsRepository.query(`
        select round(sum(sub.amount),2) as amount1,round(sum(sub.quantity),2) as quantity1,dayofweek(sa.date) as day from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
        where sub.presentation_id=${presentationId} and
        sa.date between "${date3}T00:00:00.000Z" and "${date4}T23:59:59.000Z"
        group by dayofweek(sa.date)
        `) as  QueryCharMetricWeekResult[];
        for(let data of lastData){
            switch(data.day){
                case 1:
                    days[6].amountOld=data.amount1;
                    days[6].quantityOld=data.quantity1;
                    break;  
                case 2:
                    days[0].amountOld=data.amount1;
                    days[0].quantityOld=data.quantity1;
                    break;
                case 3:
                    days[1].amountOld=data.amount1;
                    days[1].quantityOld=data.quantity1;
                    break;  
                case 4:
                    days[2].amountOld=data.amount1;
                    days[2].quantityOld=data.quantity1;
                    break;
                case 5:
                    days[3].amountOld=data.amount1;
                    days[3].quantityOld=data.quantity1;
                    break;  
                case 6:
                    days[4].amountOld=data.amount1;
                    days[4].quantityOld=data.quantity1;
                    break;
                case 7:
                    days[5].amountOld=data.amount1;
                    days[5].quantityOld=data.quantity1;
                break;
            }
        }

        for(let data of currentData){
            switch(data.day){
                case 1:
                    days[6].amountNew=data.amount1;
                    days[6].quantityNew=data.quantity1;
                    break;  
                case 2:
                    days[0].amountNew=data.amount1;
                    days[0].quantityNew=data.quantity1;
                    break;
                case 3:
                    days[1].amountNew=data.amount1;
                    days[1].quantityNew=data.quantity1;
                    break;  
                case 4:
                    days[2].amountNew=data.amount1;
                    days[2].quantityNew=data.quantity1;
                    break;
                case 5:
                    days[3].amountNew=data.amount1;
                    days[3].quantityNew=data.quantity1;
                    break;  
                case 6:
                    days[4].amountNew=data.amount1;
                    days[4].quantityNew=data.quantity1;
                    break;
                case 7:
                    days[5].amountNew=data.amount1;
                    days[5].quantityNew=data.quantity1;
                break;
            }
        }
        return days;
    }

}