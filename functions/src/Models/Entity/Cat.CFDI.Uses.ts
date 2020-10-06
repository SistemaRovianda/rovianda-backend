import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "cat_cfdi_uses"})
export class CatCFDIUses{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "c_cfdi_use", nullable: false, unique: true})
    cCFDIUse: string;

    @Column({name: "description"})
    description: string;

}