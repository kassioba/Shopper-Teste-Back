import { updateProducts, validateFile } from "../controllers/products.controller";
import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware";
import multer from 'multer'
import { csvFileSchema } from "../schemas/csvFile.schema";
import { updateDataSchema } from "../schemas/updateData.schema";

const productsRouter = Router()
const multerConfig = multer()

productsRouter
.post('/validate', multerConfig.single('file'), validateSchema(csvFileSchema, updateDataSchema), validateFile)
.put('/update', multerConfig.single('file'), validateSchema(csvFileSchema, updateDataSchema), updateProducts)

export default productsRouter