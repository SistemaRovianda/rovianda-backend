import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Packaging } from "./Packaging";
import { BoxPackaging } from "./Box.Packaging";
import { PresentationProducts } from "./Presentation.Products";

@Entity({ name: "properties_packaging" })
export class PropertiesPackaging {
    @PrimaryGeneratedColumn({ name: "porperties_id" })
    id: number;

    @ManyToOne(type => Packaging, packaging => packaging.propertiesPackaging)
    @JoinColumn({ name: "packaging_id" })
    packagingId: Packaging;

    @OneToOne(type => BoxPackaging, boxPackaging => boxPackaging.propertiesId)
    boxPackaging: BoxPackaging;

    @ManyToOne(type => PresentationProducts, presentationProducts => presentationProducts.propertiesPackaging)
    @JoinColumn({ name: "presentation_id" })
    presentationId: PresentationProducts;

    @Column({ name: "weight" })
    weight: number;

    @Column({ name: "observations" })
    observations: string;

    @Column({ name: "packs" })
    packs: number;

    @Column({ name: "pieces" })
    pieces: number
}