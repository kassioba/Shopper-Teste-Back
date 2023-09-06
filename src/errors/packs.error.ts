import { applicationError } from "protocols/applicationError";

export function packsError(productsId: Array<number>): applicationError & { id: Array<number> } {
    return{
        name: 'PacksError',
        message: 'Correlated packs and products must be all updated and have proportionally the same price',
        id: productsId
    }
}