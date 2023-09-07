import { applicationError } from "protocols/ApplicationError";

export function packsError(productsId: Array<number>): applicationError & { id: Array<number> } {
    return{
        name: 'PacksError',
        message: 'Packs e produtos correlacionados devem ser atualizados em conjunto e ter proporcionalmente o mesmo preço',
        id: productsId
    }
}