import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import ResetPasswordToken from "../../../models/ResetPasswordToken";
import Log from "../../../utils/log";
import { ResponceStatus } from "../../../types/responce_status";
import bcrypt from 'bcrypt'
import config from 'config'
import ServiceUser from "../../../models/ServiceUser";


const setPasswordRouter = Router()
const log = new Log('Route: /setPassword')

setPasswordRouter.post(
    '/',
    [
        body('password', 'bad password').isLength({ min: 5, max: 20 }).isString(),
        body('token', 'bad token').isString().isLength({ min: 1 })
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            ///// Validating request params
            if (!errors.isEmpty()) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: "Bad password or token",
                    predicate: "INCORRECT",
                    errors: errors.array(),
                });
            }
            const { password, token } = req.body
            const database = req.database

            const resetPasswordRecord = await database.findRPToken(token, true)
            /// Check if token exists
            if (!resetPasswordRecord) {
                log.info('Reset token not found')
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Reset token incorect or expired',
                    predicate: 'TOKEN_EXP'
                })
            }
            log.info('Token found')
            const userId = resetPasswordRecord.userId

            const serviceUser = await database.findUserById(userId)
            if (!serviceUser) {
                log.info('User not found')
                return res.status(ResponceStatus.StorageError).json({
                    message: 'User not found'
                })
            }
            //// Hashing new password,updating user
            const hashedPassword = bcrypt.hashSync(password, config.get('passwordSalt'))

            serviceUser.password = hashedPassword
            await serviceUser.save()

            log.info('Password reset')
            return res.status(ResponceStatus.Success).json({
                message: 'Password reset'
            })

        } catch (e: Error | any) {
            log.error(`Error ${e?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e?.message}`,
            });
        }
    }
)



export default setPasswordRouter