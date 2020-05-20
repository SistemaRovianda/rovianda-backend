import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity({name:"sales"})
export class Sale{

    @PrimaryGeneratedColumn({name:"sale_id"})
    saleId:number;

    @Column({name:"user_id"})
    userId:string;

    @Column({name:"product_id"})
    productId:string;
    
    @Column()
    quantity:number;

    @Column()
    presentation:string;
    
}