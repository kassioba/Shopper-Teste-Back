import db from "../database/database.connection";

export async function selectProductsById(codes: string[]){
    return (await db.query(`
        SELECT * FROM products
        WHERE code IN (?)
    `, [codes]))[0]
}

export async function selectPacksWithProducts() {
    return (await db.query(`
        SELECT * FROM packs
        JOIN products 
        ON products.code = packs.product_id
    `))[0]
}


export async function updateProductsPricesByCode(query: string, codes: string[]) {
    return (await db.query(`
        UPDATE products 
        SET sales_price = 
            CASE code
                ${query}
            END
        WHERE code IN (?)
    `, [codes]))[0]
}