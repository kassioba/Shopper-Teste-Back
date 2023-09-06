import { NextFunction, Request, Response } from "express";
import { ArraySchema, ObjectSchema } from 'joi'
import { Readable } from "stream";
import readline from 'readline'
import { CsvData } from '../protocols/CsvData';
import { FileDataRequest } from "protocols/FileDataRequest";

export default function validateSchema(schema: ObjectSchema, secondSchema?: ArraySchema){
    return async (req: FileDataRequest, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.file, { abortEarly: false })
        
        if(validation.error) return res.status(400).send(validation.error.message)
        
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
    }

    const dataValidation = secondSchema.validate(data, { abortEarly: false }) 

    if(dataValidation.error) return res.status(400).send(dataValidation.error.message)

        req.fileData = data

        next()
    }
}