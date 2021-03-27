import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Packaging } from "./Packaging";
import { BoxPackaging } from "./Box.Packaging";
import { PresentationProducts } from "./Presentation.Products";

@Entity({ name: "properties_packaging" })
export class PropertiesPackaging {
    @PrimaryGeneratedColumn({ name: "properties_id" })
    id: number;

    @ManyToOne(type => Packaging, packaging => packaging.propertiesPackaging)
    @JoinColumn({ name: "packaging_id" })
    packaging: Packaging;
  
    // @OneToMany(type => BoxPackaging, boxPackaging => boxPackaging.propertiesId,{eager:true})
    // boxPackaging: BoxPackaging[];

    @OneToOne(type => BoxPackaging, boxPackaging => boxPackaging.propertiesPackaging)
    boxPackaging: BoxPackaging;

    @ManyToOne(type => PresentationProducts, presentationProducts => presentationProducts.propertiesPackaging)
    @JoinColumn({ name: "presentation_id" })
    presentation: PresentationProducts;

    @Column({ name: "weight" ,type:"float"})
    weight: number;

    @Column({ name: "observations" , nullable: true})
    observations: string;

    @Column()
    units: number;

    @Column()
    active: boolean

    @Column({name:"output_of_warehouse",type:"float",nullable:false,default:0})
    outputOfWarehouse:number;

    @Column({name:"weight_of_warehouse",type:"float",nullable:false,default:0})
    weightOfWarehouse:number;
}