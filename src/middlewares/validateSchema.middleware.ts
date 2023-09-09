import { NextFunction, Request, Response } from "express";
import { ArraySchema, ObjectSchema } from 'joi'
import { Readable } from "stream";
import readline from 'readline'
import { CsvData } from '../protocols/CsvData';
import { FileDataRequest } from "../protocols/FileDataRequest";
import httpStatus from "http-status";

export default function validateSchema(schema: ObjectSchema, secondSchema?: ArraySchema){
    return async (req: FileDataRequest, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.file, { abortEarly: false })
        
        if(validation.error) return res.status(httpStatus.BAD_REQUEST).send(validation.error.message)
        
        const data: CsvData[] = []
    
        const readableFile = new Readable()
        readableFile.push(req.file.buffer)
        readableFile.push(null)
    
        const fileLine = readline.createInterface({
            input: readableFile
        })

        for await (let line of fileLine){
        if(line === 'product_code,new_price') continue
        
        data.push({
            product_code: line.split(',')[0],
            new_price: line.split(',')[1]
        })

        if(line.split(',')[2]) return res.status(httpStatus.BAD_REQUEST).send('File rows must have |product_code,new_price| format')
    }

    const dataValidation = secondSchema.validate(data, { abortEarly: false }) 

    if(dataValidation.error) return res.status(httpStatus.BAD_REQUEST).send(dataValidation.error.message)

        req.fileData = data

        next()
    }
}