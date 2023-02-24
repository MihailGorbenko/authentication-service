import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt'
import { body, check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'
import Log from '../utils/log'
import crypto from 'crypto'
import path from 'path'
import ServiceUser from "../models/ServiceUser";


enum ResponceStatus {
    NotFound = 404,
    BadRequest = 400,
    NotAuthorized = 401,
    Success = 200,
    StorageError = 507,
    ServerError = 500
}



const router =   Router()

//REGISTER

router.post(
    '/register',
    [
        body('email', 'bad email').isEmail(),
        body('password', 'bad password').isString().isLength({ min: 5 })
    ],
    async (req: Request, res: Response) => {
        const log = new Log('Route: /register')

        try {
            ///// Validating request params
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Incorect credentials',
                    predicate: 'INCORECT',
                    errors: errors.array()
                })
            }
            //////////////////////////////////////////

            const { email, password } = req.body

            ///// Check email in database
            const emailExists = await ServiceUser.findOne({ email }).exec()
            if (emailExists) {
                log.error(`User ${email} already exists`)
                return res.status(ResponceStatus.BadRequest).json(
                    {
                        message: 'User already exists',
                        predicate: 'EXIST'
                    })
            }

            //// Create new service user
            log.info(`Creating service user ${email}`)

            const hashPswd = bcrypt.hashSync(password, config.get('passwordSalt'))

            const serviceUser = new ServiceUser({ email, password:hashPswd })
                .save()
                .then(
                    onfullfiled => {
                        log.info('User saved successfully')
                        return res.status(ResponceStatus.Success).json({
                            message: 'User registred successfully',
                        })
                     },
                    onrejected => {
                        log.error('Error saving user')
                        return res.status(ResponceStatus.StorageError).json({
                            message: 'Error saving user',
                        })
                     }
                )

            ////////////////////////////////////////////

        } catch (e: Error | any) {
             log.error(e)
             return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e}`
             })
             }

    }
)


//LOGIN

//CHECK_EMAIL

//REFRESH_LOGIN

//RESET_PASSWORD

//RESET_PASWORD_LINK


//SET_PASSWORD










export default router