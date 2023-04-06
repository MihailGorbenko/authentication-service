import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import config from 'config'
import { ResponceStatus } from "../../../types/responce_status";
import Log from "../../../utils/log";



const addOriginRouter = Router()
const log = new Log('Route: /addOrigin')

addOriginRouter.post(
    '/',
    [
        body('login', 'badLogin').isIn(['Dev', 'Admin']),
        body('password', 'badPassword').isAlphanumeric().isLength({ min: 5, max: 20 }),
        body('origin', 'bad origin').isString()
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
                    try {
                        const secret = await database.addAllowedOrigin(origin, true)
                        return res
                            .status(secret ? ResponceStatus.Success : ResponceStatus.StorageError)
                            .json({
                                message: secret ? 'Added succesfully' : 'Error saving origin',
                                predicate: secret ? 'SUCCESS' : 'STRG_ERROR',
                                secret: secret ? secret : 'undefined'
                            })

                    } catch (e: Error | any) {
                        log.error(`Error ${e?.message}`);
                        return res.status(ResponceStatus.StorageError).json({
                            message: `Server error ${e?.message}`,
                        });
                    }

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
                    try {
                        const secret = await database.addAllowedOrigin(origin, false)
                        return res
                            .status(secret ? ResponceStatus.Success : ResponceStatus.StorageError)
                            .json({
                                message: secret ? 'Added succesfully' : 'Error saving origin',
                                predicate: secret ? 'SUCCESS' : 'STRG_ERROR',
                                secret: secret ? secret : 'undefined'
                            })

                    } catch (e: Error | any) {
                        log.error(`Error ${e?.message}`);
                        return res.status(ResponceStatus.StorageError).json({
                            message: `Server error ${e?.message}`,
                        });
                    }

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


export default addOriginRouter