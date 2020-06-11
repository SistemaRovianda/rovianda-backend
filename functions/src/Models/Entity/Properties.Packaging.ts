import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Packaging } from "./Packaging";
import { BoxPackaging } from "./Box.Packaging";
import { PresentationProducts } from "./Presentation.Products";

@Entity({ name: "properties_packaging" })
export class PropertiesPackaging {
    @PrimaryGeneratedColumn({ name: "porperties_id" })
    id: number;

    @ManyToOne(type => Packaging, packaging => packaging.propertiesPackaging)
    @JoinColumn({ name: "packaging_id" })
    packaging: Packaging;

    @OneToMany(type => BoxPackaging, boxPackaging => boxPackaging.propertiesPackaging)
    boxPackaging: BoxPackaging[];

    @ManyToOne(type => PresentationProducts, presentationProducts => presentationProducts.propertiesPackaging)
    @JoinColumn({ name: "presentation_id" })
    presentationProduct: PresentationProducts;

    @Column({ name: "weight" })
    weight: number;

    @Column({ name: "observations" })
    observations: string;

    @Column({ name: "packs" })
    packs: number;

    @Column({ name: "pieces" })
    pieces: number
}