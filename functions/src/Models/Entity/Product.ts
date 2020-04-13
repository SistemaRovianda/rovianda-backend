import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany } from "typeorm";
import { EntrancesDrief } from './Entrances.Drief';
import { EntrancesPacking } from './Entrances.Packing';
import { Ingredients } from './Ingredients';

@Entity({name:"product"})
export class Product{

    @PrimaryGeneratedColumn()
    @ManyToMany(type => Ingredients, ingredients=> ingredients.product_id)
    id:Ingredients[];

    @Column()
    description: string;
    
    @ManyToOne(type =>EntrancesDrief, entrances_drief => entrances_drief.product_id)
    entrancesDrief:EntrancesDrief;

    @ManyToOne(type =>EntrancesPacking, entrances_packing => entrances_packing.product_id)
    entrancesPacking:EntrancesPacking;
}