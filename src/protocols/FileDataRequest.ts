import { Request } from "express";

export type FileDataRequest = Request & {
    fileData: Array<Object>
}