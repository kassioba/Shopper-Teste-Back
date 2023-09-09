import { Product } from "../protocols/Product";
import { selectPacksWithProducts, selectProductsById, updateProductsPricesByCode } from "../repositories/products.repository";
import { CsvData } from "../protocols/CsvData";
import notFoundError from "../errors/notFoundError.error";
import { forbiddenError } from "../errors/forbiddenError.error";
import { Pack } from "../protocols/Pack";
import { packsError } from "../errors/packs.error";
import { applicationError } from "../protocols/ApplicationError";

export async function validateFileData(updateData: CsvData[]){
    const codes = []

    updateData.forEach(updt => {
        codes.push(updt.product_code)
    })

    const products = await selectProductsById(codes) as Product[]
    
    const updateHash = {}

    updateData.forEach(updt => {
        updateHash[updt.product_code] = updt.new_price
    })
    
    const packs = await selectPacksWithProducts() as Pack[]

    const errors = await checkHandler(products, updateHash, packs, codes)

    const errorHash = handleErrors(errors)

    const response = []

    products.sort((a, b) => (a.code > b.code) ? 1 : -1)

    products.forEach(prod => {
        response.push({
            code: prod.code,
            name: prod.name,
            current_price: !isNaN(Number(prod.sales_price)) ? Number(prod.sales_price).toFixed(2) : undefined,
            new_price: Number(updateHash[prod.code]).toFixed(2),
            error_message: errorHash[prod.code]
        })
    });

    
    return {
        response,
        error: !!errors.length
    }
}

export async function updateProductsByCsvData(updateData: CsvData[]) {
   const query: string[] = []
   const codes: string[] = []

    updateData.forEach(updt => {
        query.push(`WHEN ${updt.product_code} THEN ${updt.new_price}`)
        codes.push(updt.product_code)
    })

    await updateProductsPricesByCode(query.join(' '), codes)
}

function checkCodesExist(products: Product[], codes: number[]) {
    const codeHash = {}

    products.forEach(prod => {
        codeHash[prod.code] = true
    });

    const notFoundCodes = []

    codes.forEach(code => {
        if(!codeHash[Number(code)]) {
            notFoundCodes.push(Number(code))
            products.push({
                code: Number(code),
                cost_price: undefined,
                sales_price: undefined,
                name: undefined
            })
        }
    })

    if(!!notFoundCodes.length) return notFoundError(notFoundCodes)
}

function checkNewPriceIsHigher(products: Product[], updateHash: object) {
    const forbiddenCodes: number[] = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) < Number(prod.cost_price)) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) return forbiddenError(forbiddenCodes, 'HIGHER')
}

function checkNewPriceTenPercent(products: Product[], updateHash: object){
    const forbiddenCodes: number[] = []

    products.forEach(prod => {
        if(Number(updateHash[prod.code]) > Number(prod.sales_price) + (Number(prod.sales_price) * 0.1) ||
           Number(updateHash[prod.code]) < Number(prod.sales_price) - (Number(prod.sales_price) * 0.1)
        ) forbiddenCodes.push(prod.code)
    })

    if(!!forbiddenCodes.length) return forbiddenError(forbiddenCodes, 'TEN')
}

async function checkPacks(updateHash: object, packs: Pack[]){
    const packHash = {}
    const forbiddenIds = []

    packs.forEach(pack => {
        if(updateHash[pack.pack_id] && !updateHash[pack.product_id]) forbiddenIds.push(pack.pack_id)
        else if(!updateHash[pack.pack_id] && updateHash[pack.product_id]) forbiddenIds.push(pack.product_id)

        if((updateHash[pack.pack_id] && updateHash[pack.product_id]) && !packHash[pack.pack_id]) 
            packHash[pack.pack_id] = Number((Number(updateHash[pack.product_id]) * pack.qty).toFixed(2))
        else if((updateHash[pack.pack_id] && updateHash[pack.product_id]) && packHash[pack.pack_id]) 
            packHash[pack.pack_id] += Number((Number(updateHash[pack.product_id]) * pack.qty).toFixed(2))
    })

    if(forbiddenIds.length) return packsError(forbiddenIds)

    packs.forEach(pack => {
        if((updateHash[pack.pack_id] && packHash[pack.pack_id]) &&
            Number(updateHash[pack.pack_id]) !== packHash[pack.pack_id]) {
                if(!forbiddenIds.includes(pack.pack_id)) forbiddenIds.push(pack.pack_id)
                forbiddenIds.push(pack.product_id)
            }
    })

    if(forbiddenIds.length) return packsError(forbiddenIds)
}

async function checkHandler(products: Product[], updateHash: object, packs: Pack[], codes: number[]){
    const checkExist = checkCodesExist(products, codes)

    const checkHigher = checkNewPriceIsHigher(products, updateHash)

    const checkTen = checkNewPriceTenPercent(products, updateHash)

    const checkPack = await checkPacks(updateHash, packs)

    return !checkExist && !checkHigher && !checkTen && !checkPack ? [] : [checkHigher, checkTen, checkPack, checkExist]
}

function handleErrors(errors: Array<applicationError & { id: number[] }>){
    const errorHash = {}

    errors.forEach(err => {
        err?.id.forEach(id => {
            if(errorHash[id]) errorHash[id].push(err.message)
            if(!errorHash[id]) errorHash[id] = [err.message]
        })
    })

    return errorHash
}