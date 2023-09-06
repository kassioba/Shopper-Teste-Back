import { product } from "protocols/product";
import { selectPacksWithPrice, selectPacksWithProducts, selectProductsById } from "../repositories/products.repository";
import { CsvData } from "protocols/CsvData";
import notFoundError from "../errors/notFoundError.error";
import { forbiddenError } from "../errors/forbiddenError.error";
import { pack } from "protocols/pack";
import { packsError } from "../errors/packs.error";

export async function validateFileData(updateData: CsvData[]){
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

    const packs = await selectPacksWithProducts() as pack[]

    await checkPacks(updateHash, packs)

    const response = []

    products.forEach(prod => {
        response.push({
            code: prod.code,
            name: prod.name,
            current_price: Number(prod.sales_price).toFixed(2),
            new_price: Number(updateHash[prod.code])
        })
    });

    return response
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

function checkNewPriceIsHigher(products: product[], updateHash: object) {
    const forbiddenCodes = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) < Number(prod.cost_price)) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) throw forbiddenError(forbiddenCodes.join(', '), 'HIGHER')
}

function checkNewPriceTenPercent(products: product[], updateHash: object){
    const forbiddenCodes = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) > Number(prod.sales_price) + (Number(prod.sales_price) * 0.1) ||
           Number(updateHash[prod.code]) < Number(prod.sales_price) - (Number(prod.sales_price) * 0.1)
        ) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) throw forbiddenError(forbiddenCodes.join(', '), 'TEN')
}

async function checkPacks(updateHash: object, packs: pack[]){
    const packHash = {}
    const forbiddenProductsId = []

    packs.forEach(pack => {
        if(updateHash[pack.pack_id] && !updateHash[pack.product_id]) forbiddenProductsId.push(pack.pack_id)
        else if(!updateHash[pack.pack_id] && updateHash[pack.product_id]) forbiddenProductsId.push(pack.product_id)

        if((updateHash[pack.pack_id] && updateHash[pack.product_id]) && !packHash[pack.pack_id]) packHash[pack.pack_id] = Number((Number(updateHash[pack.product_id]) * pack.qty).toFixed(2))
        else if((updateHash[pack.pack_id] && updateHash[pack.product_id]) && packHash[pack.pack_id]) packHash[pack.pack_id] += Number((Number(updateHash[pack.product_id]) * pack.qty).toFixed(2))
    })

    if(forbiddenProductsId.length) throw packsError(forbiddenProductsId)

    const forbiddenPackId = []

    packs.forEach(pack => {
        if((updateHash[pack.pack_id] && packHash[pack.pack_id]) &&
            Number(updateHash[pack.pack_id]) !== packHash[pack.pack_id] &&
            !forbiddenPackId.includes(pack.pack_id)) forbiddenPackId.push(pack.pack_id)
    })

    if(forbiddenPackId.length) throw packsError(forbiddenPackId)
}