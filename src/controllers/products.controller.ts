import { Request, Response } from "express";
import { updateProductsByCsvData, validateFileData } from "../services/products.service";
import { FileDataRequest } from "protocols/FileDataRequest";
import { CsvData } from "protocols/CsvData";
import httpStatus from 'http-status'



export async function validateFile (req: FileDataRequest, res: Response){
    const updateData = req.fileData as CsvData[]

    try {
        const validatedProducts = await validateFileData(updateData)
        return res.send(validatedProducts)
    } catch (error) {
        if(error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message)
        
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message)
    }
}

export async function updateProducts(req: FileDataRequest, res: Response) {
    const updateData = req.fileData as CsvData[]

    try {
        const updatedData = await updateProductsByCsvData(updateData)
        return res.status(httpStatus.NO_CONTENT).send(updatedData)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message)
    }
}