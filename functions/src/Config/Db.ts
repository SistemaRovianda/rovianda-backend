import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../Models/Entity/Users';
import { Entrances_Meat } from '../Models/Entity/Entrances.Meat';
import { File } from '../Models/Entity/Files';
import { PropsOrder } from '../Models/Entity/Props.Order';
import { ExtrasOrders } from '../Models/Entity/Extra.Orders';
import { Product } from '../Models/Entity/Product';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';
import { Conditioning } from "../Models/Entity/Conditioning";
import { EntranceStore } from "../Models/Entity/Entrance.Store";
import { EntrancesDrief } from '../Models/Entity/Entrances.Drief';
import { EntrancesPacking } from "../Models/Entity/Entrances.Packing";
import { Ingredients } from '../Models/Entity/Ingredients';
import { ProductsRovianda } from '../Models/Entity/Products.Rovianda';
import { Formulation } from "../Models/Entity/Formulation";
import { OutletStore } from '../Models/Entity/Outlet.Store';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { Process } from '../Models/Entity/Process';
import { Grinding } from '../Models/Entity/Grinding';
import { Sale } from "../Models/Entity/Sale";
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { Pin } from '../Models/Entity/Pin';
import { Fridges } from '../Models/Entity/Fridges'
import { Cooling } from '../Models/Entity/Cooling';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { OutputsPacking } from "../Models/Entity/Outputs.Packing";


const config: ConnectionOptions = {

    type: "mysql",
    host: "akatsuki-dev.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "Holamundo1250",
    database: "rovianda",
    synchronize: true,
    logging: false,
    entities: [
        Entrances_Meat,
        File,
        User,
        PropsOrder,
        ExtrasOrders,
        Pin,
        Product,
        WarehouseDrief,
        WarehousePacking,
        Conditioning,
        EntranceStore,
        EntrancesDrief,
        EntrancesPacking,
        Ingredients,
        Product,
        ProductsRovianda,
        Formulation,
        FormulationIngredients,
        OutletStore,
        Sausaged,
        Tenderized,
        Process,
        Grinding,
        Sale,
        Fridges,
        Cooling,
        OutputsCooling,
        WarehouseDrief,
        Product,
        OutputsDrief,
        OutputsPacking
    ]

}
let connection: Connection;
export const connect = async () => {
    if (!connection) {

        try {
            connection = await createConnection(config);
            console.log("Conexión exitosa");
        } catch (err) {
            console.log("Ocurrio un error con la conexión a base de datos", err);
        }
        return connection;
    } else {
        return connection;
    }

}