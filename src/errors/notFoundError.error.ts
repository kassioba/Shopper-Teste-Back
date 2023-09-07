import { applicationError } from "protocols/ApplicationError";

export default function notFoundError(productCode?: number[]): applicationError & { id: number[] }{
    return {
        name: 'NotFoundError',
        message: productCode ? `Código de produto não encontrado` : 'Not Found',
        id: productCode
    }
}