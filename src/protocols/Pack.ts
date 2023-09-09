import { Product } from "./Product"

export type Pack = Product & {
    id: number,
    pack_id: number,
    product_id: number,
    qty: number,
}