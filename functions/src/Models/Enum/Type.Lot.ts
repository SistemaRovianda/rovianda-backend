export const TYPE ={
    FRIDGE: "FRIDGE",
    DRIEF: "DRIEF",
    PACKING: "PACKING"
}

export const LOTESTATUS= {
    OPENED:"OPENED",
    CLOSED:"CLOSED",
    PENDING:"PENDING"
}

export interface LotMeatOutput {
    lotId: number;
    quantity?: string;
    outputId: number;
  }
  