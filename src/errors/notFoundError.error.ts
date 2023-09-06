import { applicationError } from "protocols/applicationError";

export default function notFoundError(productCode?: string): applicationError{
    return {
        name: 'NotFoundError',
        message: productCode ? `Product code (${productCode}) not found` : 'Not Found'
    }
}