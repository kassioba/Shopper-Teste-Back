import { Request, Response } from "express";
import { updatePricesByProductCode } from "../services/products.service";
import { FileDataRequest } from "utils/FileDataRequest";
import { CsvData } from "utils/CsvData";
import httpStatus from 'http-status'



export async function updatePrices (req: FileDataRequest, res: Response){
    const updateData = req.fileData as CsvData[]

    try {
        const updatedProducts = await updatePricesByProductCode(updateData)
        return res.send(updatedProducts)
    } catch (error) {
        if(error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message)
        if(error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message)

        res.status(500).send(error.message)
    }
}