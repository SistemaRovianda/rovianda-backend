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
    packagingId: Packaging;
  
    // @OneToMany(type => BoxPackaging, boxPackaging => boxPackaging.propertiesId,{eager:true})
    // boxPackaging: BoxPackaging[];

    @OneToOne(type => BoxPackaging, boxPackaging => boxPackaging.propertiesPackaging)
    boxPackaging: BoxPackaging;

    @ManyToOne(type => PresentationProducts, presentationProducts => presentationProducts.propertiesPackaging)
    @JoinColumn({ name: "presentation_id" })
    presentationId: PresentationProducts;

    @Column({ name: "weight" })
    weight: number;

    @Column({ name: "observations" , nullable: true})
    observations: string;

    @Column({ name: "packs" })
    packs: number;

    @Column({ name: "pieces" })
    pieces: number
}