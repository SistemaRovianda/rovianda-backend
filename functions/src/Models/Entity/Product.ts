import { PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, ManyToMany, ManyToOne } from "typeorm";
import { EntrancePacking } from "./Entrances.Packing";
import { WarehousePacking } from "./Warehouse.Packing";
import { WarehouseDrief } from "./Warehouse.Drief";
import { OutputsPacking } from "./Outputs.Packing";
import { OutputsDrief } from "./Outputs.Drief";
import { ProductRovianda } from "./Product.Rovianda";
import { Tenderized } from "./Tenderized";
import { Sausaged } from "./Sausaged";
import { Conditioning } from "./Conditioning";
import { FormulationIngredients } from "./Formulation.Ingredients";

@Entity({ name: "product_catalog" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({nullable:true})
    type:string;

    @Column()
    mark: string;

    @Column()
    variant: string;

    @Column()
    presentation: string;

    @Column()
    category: string;

    @Column()
    state: boolean;

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

    @OneToMany(type=>FormulationIngredients,formulationIngredients=>formulationIngredients.product)
    formulationIngredients:FormulationIngredients[];

    // @OneToMany(type=> Conditioning,conditioning=>conditioning.productId)
    // conditioning: Conditioning[];

}