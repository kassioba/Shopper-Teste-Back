import db from "../database/database.connection";

export async function selectProductsById(codes: Array<string>){
    return (await db.query(`SELECT * FROM products WHERE code IN (?)`, [codes]))[0]
}