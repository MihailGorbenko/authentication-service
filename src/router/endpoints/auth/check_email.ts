import { Request, Response, Router } from "express";
import { Error } from "mongoose";
import userRegistred from "../../../middleware/userRegistred";
import Log from "../../../utils/log";
import { ResponceStatus } from "../../../types/responce_status";



const checkEmailRouter = Router()
const log = new Log('Route: /checkEmail')

checkEmailRouter.post(
    '/',
    [userRegistred],
    (req: Request, res: Response) => {

        try {
            const status = req.user ? ResponceStatus.Success : ResponceStatus.NotAuthorized
            const responseObj = {
                message: req.user ? 'User registred' : 'User not registred',
                predicate: req.user ? 'EXISTS' : 'NOT_EXISTS'
            }

            return res.status(status).json(responseObj)

        } catch (e: Error | any) {
            log.error(`Error ${e?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e?.message}`,
            });

        }
    }
)


export default checkEmailRouter