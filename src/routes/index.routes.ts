import { Router } from "express";
import productsRouter from "./products.routes";

const router = Router()

router.use(productsRouter)

export default router