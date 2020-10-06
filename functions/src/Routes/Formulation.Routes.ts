import { routeInterface } from "../Models/Route.Interface";
import { FormulationController } from "../Controllers/Formulation.Controller";

export const formulationRoutes: Array<routeInterface>=[
    {
        url: "/rovianda/formulation",
        method: "post",
        controller: FormulationController,
        target: "createFormulation"
    },
    {
        url: "/rovianda/formulation-details/:formulationId",
        method: "get",
        controller: FormulationController,
        target: "getFormulationDetails"
    }
    ,
    {
        url: "/rovianda/formulation/product-rovianda/:productRoviandaId",
        method: "get",
        controller: FormulationController,
        target: "getFormulationByProductRovianda"
    }
    ,
    {
        url: "/rovianda/formulation/:rawMaterialId",// "/rovianda/formulation/products"
        method: "get",
        controller: FormulationController,
        target: "getFormulationByRawMaterial"
    },{
        url: "/rovianda/process/lote/meat",
        method: "get",
        controller: FormulationController,
        target: "getAllFormulationLoteMeat"
    },{
        url: "/rovianda/lote/meat/process",
        method: "get",
        controller: FormulationController,
        target: "getAllLotMeatByProductId"
    }
]