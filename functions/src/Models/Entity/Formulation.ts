import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, JoinTable } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";
import { Product } from "./Product";
import { OutputsDrief } from "./Outputs.Drief";


@Entity({ name: "formulation" })
export class Formulation {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => ProductRovianda)
    @JoinColumn({ name: "product_rovianda_id" })
    productRoviandaId: ProductRovianda;

    @Column({ name: "lote_interno" })
    loteInterno: string;

    @Column()
    temp: string;

    @Column({ name: "water_temp" })
    waterTemp: string;

    @Column({ name: "new_lote" })
    newLote: string;

}