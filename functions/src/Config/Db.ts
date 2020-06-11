import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { File } from '../Models/Entity/Files';
import { Product } from '../Models/Entity/Product';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';
import { Conditioning } from "../Models/Entity/Conditioning";
import { EntranceStore } from "../Models/Entity/Entrance.Store";
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";
import { Formulation } from "../Models/Entity/Formulation";
import { OutletStore } from '../Models/Entity/Outlet.Store';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { Process } from '../Models/Entity/Process';
import { Grinding } from '../Models/Entity/Grinding';
import { Sale } from "../Models/Entity/Sale";
import { Pin } from '../Models/Entity/Pin';
import { Fridge } from '../Models/Entity/Fridges'
import { Cooling } from '../Models/Entity/Cooling';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { OutputsPacking } from "../Models/Entity/Outputs.Packing";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { OvenProducts } from "../Models/Entity/Oven.Products";
import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
import { Packaging } from "../Models/Entity/Packaging";
import { User } from "../Models/Entity/User";
import { Roles } from "../Models/Entity/Roles";
import { DryingLabel } from "../Models/Entity/Dryng.Label";
import { Inspection } from '../Models/Entity/Inspection';
import { SalesRequest } from '../Models/Entity/Sales.Request';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { BoxPackaging } from "../Models/Entity/Box.Packaging";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";

const config: ConnectionOptions = {

    type: "mysql",
    host: "akatsuki-dev.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "Holamundo1250",
    database: "rovianda-test-dev",
    synchronize: true,
    logging: false,
    entities: [
        EntranceMeat,
        Roles,
        File,
        User,
        Pin,
        Product,
        WarehousePacking,
        Conditioning,
        EntranceStore,
        EntranceDrief,
        EntrancePacking,
        RevisionsOvenProducts,
        OvenProducts,
        Product,
        ProductRovianda,
        Formulation,
        /*FormulationIngredients,*/
        OutletStore,
        Sausaged,
        Tenderized,
        Process,
        Grinding,
        Sale,
        Fridge,
        Cooling,
        OutputsCooling,
        WarehouseDrief,
        OutputsDrief,
        OutputsPacking,
        OvenProducts,
        RevisionsOvenProducts,
        Packaging,
        DryingLabel,
        Inspection,
        SalesRequest,
        Reprocessing,
        PresentationProducts,
        BoxPackaging,
        PropertiesPackaging
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