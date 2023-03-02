import { NextFunction, Request, Response } from "express";
import { DB } from "../storage/db.api";

export default function attachDatabase(database: DB) {
    return async function (req: Request, res: Response, next: NextFunction) {
        req.database = database
        next()
    }
}

