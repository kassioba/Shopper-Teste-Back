import { product } from "./product"

export type pack = product & {
    id: number,
    pack_id: number,
    product_id: number,
    qty: number,
}