import { GeoCodingController } from "../Controllers/GeoCoding.controller";
import { routeInterface } from "../Models/Route.Interface";
export const GeocodingRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/geocodingaddress",//DONE
        method:"post",
        controller:GeoCodingController,
        target:"getCoordenatesAddress"
    },
    {
        url: "/rovianda/getcurrentvisits/clients-location",//DONE
        method: "get",
        controller: GeoCodingController,
        target: "getCurrentVisitsClientsLocation"
    }
];