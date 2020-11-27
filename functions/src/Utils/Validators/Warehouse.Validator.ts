import { WarehouseForm } from "../../Models/DTO/Warehouse.DTO";

export function validateWarehouse(warehouseForm:WarehouseForm){
    
    if(!warehouseForm.description) throw new Error("[400], falta el encargado del almacen");
 /*   if(!warehouseForm.movEntrance) throw new Error("[400],falta el movimiento de entrada");
    if(!warehouseForm.movOutput) throw new Error("[400],falta el moviemiento de salida");*/
}