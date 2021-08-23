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
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { BoxPackaging } from "../Models/Entity/Box.Packaging";
import { PropertiesPackaging } from "../Models/Entity/Properties.Packaging";
import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { Raw } from "../Models/Entity/Raw";
import { Devices } from "../Models/Entity/Devices";
import { Store } from "../Models/Entity/Store";
import { Maintenance } from "../Models/Entity/Maintenance";
import { StoreDevice } from "../Models/Entity/Store.Devices";
import { OrderSeller } from "../Models/Entity/Order.Seller";
import { SubOrderMetadata } from "../Models/Entity/SubOrder.Sale.Seller.Metadata";
import { SellerInventory } from "../Models/Entity/Seller.Inventory";
import { Address } from "../Models/Entity/Address";
import { Client } from "../Models/Entity/Client";
import { Debts } from "../Models/Entity/Debts";
import { Sale } from "../Models/Entity/Sales";
import { SellerOperation } from "../Models/Entity/Seller.Operations";
import { SubSales } from "../Models/Entity/Sub.Sales";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";
import { CatCFDIUses } from "../Models/Entity/Cat.CFDI.Uses";
import { CatPaymentTypes } from "../Models/Entity/Cat.Payment.Types";
import { Devolution } from "../Models/Entity/Devolution";
import { Cheese } from "../Models/Entity/Cheese";
import { VisitClientOperation } from "../Models/Entity/VisitClientOperation";
import { DayVisited } from "../Models/Entity/DayVisited";
import { SaleCancel } from "../Models/Entity/SaleCancel";
import { ProcessIngredientFormulation } from "../Models/Entity/ProcessIngredientFormulation";
import { DevolutionSellerRequest } from "../Models/Entity/DevolutionSellerRequest";
import { DevolutionOldSubSales } from "../Models/Entity/DevolutionOldSubSales";

const config: ConnectionOptions = {

    type: "mysql",
    host: "rovisapi.dyndns.tv",//"akatsuki-dev.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",//
    port: 3306,
    username: "master_rovianda",//"admin",//
    password: "Sistemas2020",//"Holamundo1250",//
    database: "bd_rovianda",//"rovianda-dev",//
    connectTimeout:60000,
    charset:"utf8",
    maxQueryExecutionTime:60000,
    synchronize: false,
    logging: false,
    debug:false,
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
        OvenProducts,
        ProductRovianda,
        Formulation,
        FormulationIngredients,
        OutletStore,
        Sausaged,
        Tenderized,
        Process,
        Grinding,
        Fridge,
        Cooling,
        OutputsCooling,
        WarehouseDrief,
        OutputsDrief,
        OutputsPacking,
        RevisionsOvenProducts,
        Packaging,
        DryingLabel,
        Inspection,
        OrderSeller,
        Reprocessing,
        PresentationProducts,
        BoxPackaging,
        PropertiesPackaging,
        Raw,
        Devices,
        Store,
        Maintenance,
        StoreDevice,
        SubOrder,
        SubOrderMetadata,
        SellerInventory,
        Address,Debts,Sale,SellerOperation,SubSales,
        Defrost,DefrostFormulation, CatCFDIUses, CatPaymentTypes,
        Client,Devolution,
        Cheese,
        DayVisited,
        VisitClientOperation,
        SaleCancel,
        ProcessIngredientFormulation,
        DevolutionSellerRequest,
        DevolutionOldSubSales
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