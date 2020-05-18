import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Packaging } from './Packaging';

@Entity({ name: "products_rovianda" })
export class ProductRovianda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Product, product => product.productRovianda)
    ingredients: Product[];

    @ManyToOne(type => Packaging, packaging => packaging.productId)
    pack: Product;
}