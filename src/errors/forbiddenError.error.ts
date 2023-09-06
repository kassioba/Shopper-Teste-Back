import { applicationError } from "protocols/applicationError";

export function forbiddenError(productCodes?: string, type?: 'HIGHER' | 'TEN'): applicationError{
    return {
        name: 'ForbiddenError',
        message: productCodes && type === 'HIGHER' ? `new_price of products (${productCodes}) cannot be lower than cost_price` : 
                 productCodes && type === 'TEN' ? `new_price of products (${productCodes}) cannot be 10% higher or lower than sales_price`
                : 'Forbidden'
    }
}