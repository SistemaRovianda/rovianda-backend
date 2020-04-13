import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredients } from "./Ingredients";

@Entity({name:"products_rovianda"})
export class ProductsRovianda{
    
    @PrimaryGeneratedColumn()
    @ManyToMany(type => Ingredients, ingredients=> ingredients.products_rovianda_id)
    id:Ingredients[];

    @Column()
    name: string;
    
}