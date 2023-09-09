import { OrderSellerRequest, OrderSellerRequestProduct } from "../../Models/DTO/Sales.ProductDTO";

export async function validateOrderSeller(order:OrderSellerRequest){
    if(typeof order.urgent!="boolean") throw new Error("[400],falta el parametro urgent en el request");
    if(!order.products) throw new Error("[400],falta el parametro products en el request");
    if(!order.products.length) throw new Error("[400],el parametro products no puede estar vacio en el request");
    let dateHour = new Date(order.date);
    dateHour.setHours(dateHour.getHours()-6);
    console.log("HOURS",dateHour.getHours(),order.urgent==true);
    if(order.urgent==true && (dateHour.getHours())>=23 ) throw new Error("[400], no se puede solicitar una orden urgente despues de las 12");
    await validateOrderSellerProducts(order.products);
}

async function validateOrderSellerProducts(products:Array<OrderSellerRequestProduct>){
    for(let i=0;i<products.length;i++){
        if(!products[i].quantity) throw new Error(`[400],falta el parametro quantity en el request en el producto: ${i+1}`);
        if(products[i].quantity<1) throw new Error(`[400],el parametro quantity no puede ser menor a uno, en el producto: ${i+1}`);
    }
}