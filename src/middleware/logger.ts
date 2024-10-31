import { NextFunction, Request, Response } from "express";

export const logger = (req:Request, res:Response, next:NextFunction) => {
    //request_id] [timestamp] [http method][http headers]
    const id = req.params.id;
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const timestamp = new Date();
    console.log(id, timestamp, method, url, headers);

    next();
}