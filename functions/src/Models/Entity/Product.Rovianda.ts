import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { Packaging } from './Packaging';
import { Process } from "./Process";
import { Formulation } from "./Formulation";
import { OvenProducts } from "./Oven.Products";

@Entity({ name: "products_rovianda" })
export class ProductRovianda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Product, product => product.productRovianda)
    @JoinTable({name:"ingredients"})
    ingredients: Product[];

    @OneToMany(type => Packaging, packaging => packaging.productId)
    packaging: Packaging[];

    @OneToMany(type=>Process, process=>process.product)
    process:Process[];

    @OneToMany(type=> Formulation,formulation=>formulation.productRovianda,{eager:false})
    formulation: Formulation[];

    @OneToMany(type=> OvenProducts,ovenProducts=>ovenProducts.product,{eager:false})
    ovenProducts: OvenProducts[];

}