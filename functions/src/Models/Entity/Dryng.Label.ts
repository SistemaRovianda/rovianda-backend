import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity({name:"drying_label"})
export class DryingLabel{

    @PrimaryGeneratedColumn({name:"drying_id"})
    dryingId:number;

    @Column({name:"product_id"})
    productId:number;

    @Column({name:"lot_id"})
    lotId:string;

    @Column({name:"date_entrance"})
    dateEntrance:string;

    @Column({name:"date_output"})
    dateOutput:string;

}






