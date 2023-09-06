import db from "../database/database.connection";

export async function selectProductsById(codes: Array<string>){
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

export async function selectPacksWithPrice() {
    return (await db.query(`
        SELECT * FROM packs
        JOIN products 
        ON products.code = packs.pack_id
    `))[0]
}