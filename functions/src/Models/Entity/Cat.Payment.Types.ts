import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "cat_payment_types"})
export class CatPaymentTypes{
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "c_payment_shape", unique: true, nullable: false})
    cPaymentShape: string;

    @Column({name: "description"})
    description: string;
    
}