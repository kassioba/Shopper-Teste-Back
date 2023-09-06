import { product } from "utils/product";
import { selectProductsById } from "../repositories/products.repository";
import { CsvData } from "utils/CsvData";
import notFoundError from "../errors/notFoundError.error";
import { forbiddenError } from "../errors/forbiddenError.error";

export async function updatePricesByProductCode(updateData: CsvData[]){
    console.log(updateData)
    const codes = []

    updateData.forEach(updt => {
        codes.push(updt.product_code)
    })

    const products = await selectProductsById(codes) as product[]

    checkCodesExist(products, codes)
    
    const updateHash = {}

    updateData.forEach(updt => {
        updateHash[updt.product_code] = updt.new_price
    })

    checkNewPriceIsHigher(products, updateHash)

    checkNewPriceTenPercent(products, updateHash)

    return products
}

function checkCodesExist(products: product[], codes: Array<number>) {
    const codeHash = {}

    products.forEach(prod => {
        codeHash[prod.code] = true
    });

    const notFoundCodes = []

    codes.forEach(code => {
        if(!codeHash[code]) notFoundCodes.push(code)
    })

    if(!!notFoundCodes.length) throw notFoundError(notFoundCodes.join(', '))
}

function checkNewPriceIsHigher(products: product[], updateHash: Object) {
    const forbiddenCodes = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) < Number(prod.cost_price)) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) throw forbiddenError(forbiddenCodes.join(', '), 'HIGHER')
}

function checkNewPriceTenPercent(products: product[], updateHash: Object){
    const forbiddenCodes = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) > Number(prod.sales_price) + (Number(prod.sales_price) * 0.1) ||
           Number(updateHash[prod.code]) < Number(prod.sales_price) - (Number(prod.sales_price) * 0.1)
        ) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) throw forbiddenError(forbiddenCodes.join(', '), 'TEN')
}