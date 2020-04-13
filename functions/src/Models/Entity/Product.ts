import { PrimaryGeneratedColumn, Column, Entity, OneToMany  } from "typeorm";
import { WarehouseDrief } from './Warehouse.Drief';
import { OutputsDrief } from './Outputs.Drief';


@Entity({name:"product"})
export class Product{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    description:string;
    
    @OneToMany(type=> WarehouseDrief,warehouseDrief=>warehouseDrief.product)
    warehouseDrief: WarehouseDrief[];

    @OneToMany(type=> OutputsDrief,outputsDrief=>outputsDrief.product)
    outputsDrief: OutputsDrief[];

    //@OneToMany(type=>ProductSale,productSale=>productSale.product)
    //productSale:ProductSale[];

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}