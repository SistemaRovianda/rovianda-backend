import { routeInterface } from "../Models/Route.Interface";
// import { ProcessController } from '../Controllers/Process.Controller';
import { ConditioningController } from '../Controllers/Conditioning.Controller';
import { TenderizedController } from "../Controllers/Tenderized.Controller";
import { GrindingController } from "../Controllers/Grinding.Controller";
import { SausagedController } from '../Controllers/Sausaged.Controller';
import { UserController } from '../Controllers/User.Controller';
import { ProcessController } from "../Controllers/Process.Controller";
import { ProcessStatus } from "../Models/Enum/ProcessStatus";
export const processRoutes: Array<routeInterface> = [

    {
        url:"/rovianda/process/:processId",
        method:"get",
        controller:ProcessController,
        target:"getProcessDetails"
    },{
        url:"/rovianda/process-formulation/:processId",
        method: "get",
        controller: ProcessController,
        target: "getFormulationOfProcess"
    },{
        url:"/rovianda/defrost",
        method:"post",
        controller:ProcessController,
        target:"createDefrost"
    },
    {
        url:"/rovianda/defrost/:defrostId",
        method:"get",
        controller:ProcessController,
        target:"getDefrostDetails"
    }
    ,
    {
        url: "/rovianda/defrost/:defrostId", //rovianda/process/:processId
        method: "put",  // path to put
        controller: ProcessController,
        target: "updateDefrostHourAndDate"
    },{
        url: "/rovianda/defrost-getactive",
        method: "get",
        controller: ProcessController,
        target: "getAllDefrostActive"
    },
    {
        url: "/rovianda/defrost-getinactive",
        method: "get",
        controller: ProcessController,
        target: "getAllInactiveDefrost"
    }
    ,{
        url: "/rovianda/defrost/:defrostId",
        method: "patch",
        controller: ProcessController,
        target: "closeDefrost"
    },{
        url:"/rovianda/process",
        method:"get",
        controller:ProcessController,
        target:"getAllProcess"
    },{
        url:"/rovianda/process/conditioning/:processId",
        method:"get",
        controller:ConditioningController,
        target:"getConditioning"
    },{
        url:"/rovianda/process/grinding/:processId",
        method: "get",
        controller: ProcessController,
        target: "getGrindingByProcessId"
    },
    {
        url: "/rovianda/process/conditioning/:formulationId",
        method: "post",
        controller: ConditioningController,
        target: "createConditioningByFormulationId"
    }, {
        url: "/rovianda/process/injection-tenderized/:formulationId",
        method: "post",
        controller: TenderizedController,
        target: "createTenderized"
    }, {
        url: "/rovianda/process/injection-tenderized/:processId",
        method: "get",
        controller: TenderizedController,
        target: "getTenderized"
    }, {
        url: "/rovianda/process/grinding/:formulationId",
        method: "post",
        controller: GrindingController,
        target: "createGrinding"
    }, {
        url: "/rovianda/process/sausage/:formulationId",
        method: "post",
        controller: SausagedController,
        target: "createSausaged"
    },{
        
            url: "/rovianda/process/sausage/:sausageId",
            method: "put",
            controller: SausagedController,
            target: "updateSausageHours"
        
    }, 
    {
        url: "/rovianda/process/sausage/:processId",
        method: "get",
        controller: SausagedController,
        target: "getSausagedByProcess"
    }, {
        url: "/rovianda/process/users/:processId",
        method: "post",
        controller: ProcessController,
        target: "createUserProcess"
    },
    {
        url: "/rovianda/process/:processId",
        method: "patch",
        controller: ProcessController,
        target: "updateStatusProcess"
    },
    {
        url: "/rovianda/process/users/:processId",
        method: "get",
        controller: ProcessController,
        target: "getUserProcessVerifier"
    },
    {
        url: "/rovianda/sausage/:sausageId",
        method: "patch",
        controller: SausagedController,
        target: "updateSausaged"
    },
    {
        url:"/rovianda/process/intern",
        method:"post",
        controller:ProcessController,
        target:"createProcessInter"
    },
    {
        url: "/rovianda/process-availables/products",
        method: "get",
        controller: ProcessController,
        target: "getProcessProductsAvailables"
    },
    {
        url: "/rovianda/process-ingredientes/availables",
        method: "get",
        controller: ProcessController,
        target: "getProcessProcessIngredientsAvailables"
    }
    ,
    {
        url: "/rovianda/process-reprocesing",
        method: "post",
        controller: ProcessController,
        target: "saveReprocesing"
    },{
        url: "/rovianda/process/reprocesing/:processId",
        method: "get",
        controller: ProcessController,
        target: "getReprocesingOfProcess"
    },
    {
        url: "/rovianda/process/reprocesing-vinculated/:processId",
        method: "get",
        controller: ProcessController,
        target: "getReprocesingVinculatedToProcess"
    },
    {
        url: "/rovianda/process/use-reprocesing",
        method: "post",
        controller: ProcessController,
        target: "useReprocesingLots"
    },
    {
        url: "/rovianda/process/grinding-reprocesing/:processId",
        method:"put",
        controller: ProcessController,
        target: "setGrindingReprocesing"
    },
    {
        url: "/rovianda/process-reprocesing/getall",
        method: "get",
        controller: ProcessController,
        target: "getAllLotsReprocesing"
    },
    {
        url: "/rovianda/process-subproducts",
        method: "post",
        controller: ProcessController,
        target: "registerSubProductsToProcess"
    },
    {
        url: "/rovianda/process-subproducts/:processId",
        method: "get",
        controller: ProcessController,
        target: "getAllSubProductsOfProcess"
    },
    {
        url: "/rovianda/process-subproducts/:subProductId",
        method: "delete",
        controller: ProcessController,
        target: "deleteSubProduct"
    }
];