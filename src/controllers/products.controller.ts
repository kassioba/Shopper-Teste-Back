import { Request, Response } from "express";
import { validateFileData } from "../services/products.service";
import { FileDataRequest } from "protocols/FileDataRequest";
import { CsvData } from "protocols/CsvData";
import httpStatus from 'http-status'



export async function validateFile (req: FileDataRequest, res: Response){
    const updateData = req.fileData as CsvData[]

    try {
        const updatedProducts = await validateFileData(updateData)
        return res.send(updatedProducts)
    } catch (error) {
        if(error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message)
        if(error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message)
        if(error.name === 'PacksError') return res.status(httpStatus.FORBIDDEN).send({message: error.message, id: error.id})

        res.status(500).send(error.message)
    }
}