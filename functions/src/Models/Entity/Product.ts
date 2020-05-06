import { PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, ManyToMany } from "typeorm";
import { EntrancePacking } from "./Entrances.Packing";
import { WarehousePacking } from "./Warehouse.Packing";
import { WarehouseDrief } from "./Warehouse.Drief";
import { OutputsPacking } from "./Outputs.Packing";
import { OutputsDrief } from "./Outputs.Drief";
import { ProductRovianda } from "./Product.Rovianda";

@Entity({ name: "product" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    type: string;

    @OneToMany(type => EntrancePacking, entrancePacking => entrancePacking.product)
    entrancePacking: EntrancePacking[];

    @OneToMany(type => WarehousePacking, warehousePacking => warehousePacking.product)
    warehousePacking: WarehousePacking[];

    @OneToMany(type => WarehouseDrief, warehouseDrief => warehouseDrief.product)
    warehouseDrief: WarehouseDrief[];

    @OneToMany(type => OutputsPacking, out => out.product)
    outputsPacking: OutputsPacking[];

    @OneToMany(type => OutputsDrief, outputdrief => outputdrief.product)
    outputsDrief: OutputsDrief[];

    @OneToMany(type => ProductRovianda, productRovianda => productRovianda.ingredients)
    productRovianda: ProductRovianda[];

}