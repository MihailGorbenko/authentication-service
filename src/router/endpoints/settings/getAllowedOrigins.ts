import config from "config";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { ResponceStatus } from "../../../types/responce_status";
import Log from "../../../utils/log";

const allowedOriginsRouter = Router()
const log = new Log('Route: /getAllowedOrigins')

allowedOriginsRouter.post(
    '/',
    [
        body('password', 'badPassword').isAlphanumeric().isLength({ min: 5 }),
    ],
    async (req: Request, res: Response) => {
        try {
            ///Check params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Incorrect credentials or origin',
                    predicate: 'INCORRECT',
                    errors: errors.array()
                })
            }
            /////////////////

            const { login, password, origin } = req.body
            const database = req.database

            if (login === 'Dev') {
                if (password === config.get('devPassword')) {
                    const getResult = await database.getAllowedOrigins()
                    return res
                        .status(ResponceStatus.Success)
                        .json({
                            origins: getResult
                        })
                }
                else {
                    return res.status(ResponceStatus.NotAuthorized).json({
                        message: 'Invalid password for {dev}',
                        predicate: 'INVALID'
                    })
                }
            }
            else {
                if (password === config.get('adminPassword')) {
                    const getResult = await database.getAllowedOrigins()
                    return res
                        .status(ResponceStatus.Success)
                        .json({
                            origins: getResult
                        })
                }
                else {
                    return res.status(ResponceStatus.NotAuthorized).json({
                        message: 'Invalid password for {admin}',
                        predicate: 'INVALID'
                    })
                }

            }



        } catch (err: Error | any) {
            log.error(`Error ${err?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${err?.message}`,
            });
        }

    })



export default allowedOriginsRouter