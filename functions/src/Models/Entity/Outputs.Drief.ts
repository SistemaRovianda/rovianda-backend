import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany, JoinTable, ManyToMany, JoinColumn, OneToOne  } from "typeorm";
import { Formulation } from "./Formulation";
import { FormulationIngredients } from "./Formulation.Ingredients";
import { Product } from './Product';
import { WarehouseDrief } from "./Warehouse.Drief";


@Entity({name:"outputs_drief"})
export class OutputsDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Product, product=>product.outputsDrief,{eager:true, onDelete:"SET NULL"})
    product:Product; 

    @ManyToOne(type => WarehouseDrief, warehouseDrief => warehouseDrief.outputDriefs)
    warehouseDrief: WarehouseDrief;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @Column()
    date:string;   

    @Column()
    observations:string;

    @Column()
    status:string;

    
    @OneToOne(type=>FormulationIngredients,formulationI=>formulationI.lotId)
    formulationIngredient:FormulationIngredients;
    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}