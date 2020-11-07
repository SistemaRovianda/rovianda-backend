import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PresentationProducts } from "./Presentation.Products";

@Entity({name:"devolutions"})
export class Devolution{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    units:number;

    @Column({name:"lot_id"})
    lotId:string;

    @ManyToOne(type=>PresentationProducts,presentation=>presentation.devolutions,{eager:true})
    @JoinColumn({name:"presentation_id"})
    presentationProduct:PresentationProducts;

    @Column()
    date:string;

}