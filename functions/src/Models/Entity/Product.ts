import { PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, ManyToMany, ManyToOne } from "typeorm";
import { EntrancePacking } from "./Entrances.Packing";
import { WarehousePacking } from "./Warehouse.Packing";
import { WarehouseDrief } from "./Warehouse.Drief";
import { OutputsPacking } from "./Outputs.Packing";
import { OutputsDrief } from "./Outputs.Drief";
import { ProductRovianda } from "./Product.Rovianda";
import { Tenderized } from "./Tenderized";

@Entity({ name: "product_catalog" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

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

    @ManyToMany(type => ProductRovianda, productRovianda => productRovianda.ingredients)
    productRovianda: ProductRovianda[];

    @OneToMany(type=> Tenderized,tenderized=>tenderized.productId)
    tenderized: Tenderized[];

}