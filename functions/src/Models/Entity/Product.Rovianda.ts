import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { Packaging } from './Packaging';
import { Process } from "./Process";
import { Formulation } from "./Formulation";

@Entity({ name: "products_rovianda" })
export class ProductRovianda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Product, product => product.productRovianda)
    @JoinTable({name:"ingredients"})
    ingredients: Product[];

    @ManyToOne(type => Packaging, packaging => packaging.productId)
    pack: Product;

    @OneToMany(type=>Process,process=>process.productId)
    process:Process[];

    @OneToMany(type=> Formulation,formulation=>formulation.productRovianda,{eager:false})
    formulation: Formulation[];

    // @OneToMany(type=> Cooling,cooling=>cooling.fridge,{eager:false})
    // coolings: Cooling[];
}