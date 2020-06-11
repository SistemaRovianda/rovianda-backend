import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { PropertiesPackaging } from "./Properties.Packaging";
import { ProductRovianda } from "./Product.Rovianda";

@Entity({ name: "presentation_products" })
export class PresentationProducts {
    @PrimaryGeneratedColumn({ name: "presentation_id" })
    id: number;

    @Column({ name: "presentation" })
    presentation: number;

    @Column({ name: "type_presentation" })
    presentationType: string;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.presentationProduct)
    propertiesPackaging: PropertiesPackaging[];

    @ManyToMany(type => ProductRovianda, productRovianda => productRovianda.presentationProducts)
    @JoinTable({
        name: "products_rovianda_presentation",
        joinColumn: {name: "presentation_id"},
        inverseJoinColumn: {name: "product_id"}
    })
    productsRovianda: ProductRovianda[];
}