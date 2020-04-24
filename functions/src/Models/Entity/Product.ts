import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, ManyToMany, JoinTable, OneToOne  } from "typeorm";
import { WarehouseDrief } from './Warehouse.Drief';
import { OutputsDrief } from './Outputs.Drief';
import { EntrancesDrief } from './Entrances.Drief';
import { EntrancesPacking } from './Entrances.Packing';
import { Ingredients } from './Ingredients';
import { WarehousePacking } from './Warehouse.Packing';
import { OutputsPacking } from './Outputs.Packing';

@Entity({name:"product"})
export class Product{

    @PrimaryGeneratedColumn()
    @ManyToMany(type => Ingredients, ingredients=> ingredients.product_id)
    id:number;

    @Column()
    description:string;
   
    @OneToMany(type=>WarehousePacking,warehousePacking=>warehousePacking.product)
    warehousePacking:WarehousePacking[];

    @OneToMany(type=>WarehouseDrief,warehouseDrief=>warehouseDrief.product)
    warehouseDrief:WarehouseDrief[];

    @OneToMany(type=> OutputsDrief,outputsDrief=>outputsDrief.product)
    outputsDrief: OutputsDrief[];

    @OneToMany(type=> OutputsPacking,outputsPacking=>outputsPacking.product)
    outputsPacking: OutputsPacking[];

    //@OneToMany(type=>ProductSale,productSale=>productSale.product)
    //productSale:ProductSale[];

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
    
    @ManyToOne(type =>EntrancesDrief, entrances_drief => entrances_drief.product_id)
    entrancesDrief:EntrancesDrief;

    @ManyToOne(type =>EntrancesPacking, entrances_packing => entrances_packing.product_id)
    entrancesPacking:EntrancesPacking;
}