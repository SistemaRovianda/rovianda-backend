import { CatalogsController } from "../Controllers/Catalogs.Controller";
import { routeInterface } from "../Models/Route.Interface";

export const catalogsRoutes: Array<routeInterface> = [
    {
        url: "/rovianda/catalogos-de-cfdi",//DONE
        method: "get",
        controller: CatalogsController,
        target: "getAllCFDIUses"
    },
    {
        url: "/rovianda/catalogo-pagos-sat",//DONE
        method: "get",
        controller: CatalogsController,
        target: "getAllPaymentTypes"
    }
]