import { routeInterface } from "../Models/Route.Interface";
// import { ProcessController } from '../Controllers/Process.Controller';
import { ConditioningController } from '../Controllers/Conditioning.Controller';
import { TenderizedController } from "../Controllers/Tenderized.Controller";
import { GrindingController } from "../Controllers/Grinding.Controller";
import { SausagedController } from '../Controllers/Sausaged.Controller';
import { UserController } from '../Controllers/User.Controller';
import { ProcessController } from "../Controllers/Process.Controller";
export const processRoutes: Array<routeInterface> = [

    {
        url: "/rovianda/process",
        method: "post",
        controller: ProcessController,
        target: "createProcess"
    },
    {
        url: "/rovianda/process",
        method: "get",
        controller: ProcessController,
        target: "getAllProcess"
    },
    {
        url: "/rovianda/process/grinding/:processId",
        method: "get",
        controller: ProcessController,
        target: "getGrindingByProcessId"
    },
    {
        url: "/rovianda/process/conditioning/:processId",
        method: "post",
        controller: ConditioningController,
        target: "createConditioningByProcessId"
    }, {
        url: "/rovianda/process/conditioning/:processId",
        method: "get",
        controller: ConditioningController,
        target: "getConditioning"
    }, {
        url: "/rovianda/process/injection-tenderized/:processId",
        method: "post",
        controller: TenderizedController,
        target: "createTenderized"
    }, {
        url: "/rovianda/process/injection-tenderized/:processId",
        method: "get",
        controller: TenderizedController,
        target: "getTenderized"
    }, {
        url: "/rovianda/process/grinding/:processId",
        method: "post",
        controller: GrindingController,
        target: "createGrinding"
    }, {
        url: "/rovianda/process/sausage/:processId",
        method: "post",
        controller: SausagedController,
        target: "createSausaged"
    }, {
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
        url: "/rovianda/process/defrost/:processId",
        method: "patch",
        controller: ProcessController,
        target: "updateProcessHourAndDate"
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
    }
];