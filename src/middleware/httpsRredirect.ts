import { Request, Response,NextFunction } from "express"

export default function(req:Request,res: Response,next:NextFunction):void {
    if(!req.secure){
        return res.redirect(`https://${req.headers.host}${req.url}`)
    }

    next()
}