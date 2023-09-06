import { applicationError } from "protocols/applicationError";
import { product } from "protocols/product";

export function validationErrorHandler(error: applicationError, products: product[], updateHash: object, codes: Array<number>){
    const response = []

    products.forEach(prod => {
        response.push({
            code: prod.code,
            name: prod.name,
            current_price: Number(prod.sales_price).toFixed(2),
            new_price: Number(updateHash[prod.code]),
            error: codes.includes(prod.code) && error.message
        })
    });

    return response
}