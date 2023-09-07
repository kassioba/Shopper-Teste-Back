import { applicationError } from "../protocols/ApplicationError";

export function forbiddenError(productCodes?: number[], type?: 'HIGHER' | 'TEN'): applicationError & { id: number[] } {
    return {
        name: 'ForbiddenError',
        message: type === 'HIGHER' ? `Novo preço não pode ser menor que preço de custo` : 
                 type === 'TEN' ? `Novo preço não pode ser 10% maior ou menor que preço de venda`
                : 'Forbidden',
        id: productCodes
    }
}