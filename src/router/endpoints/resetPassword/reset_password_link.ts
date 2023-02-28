import { Request, Response, Router } from "express";
import cors from 'cors'
import { ResponceStatus } from "../../responce_status";
import Log from "../../../utils/log";
import ResetPasswordToken from "../../../models/ResetPasswordToken";
import expire_in_ms from "../../expire_in_ms";
const log = new Log('Route: /resetPasswordLink')
import config from 'config'


const resetPasswordLinkRouter = Router()

resetPasswordLinkRouter.post(
    '/:token',
    async (req: Request, res: Response) => {
        try {
            const token = req.params.token
            console.log(req.params);

            const resetPasswordRecord = await ResetPasswordToken.findOne({ token })
            if (!resetPasswordRecord) {
                log.info('Reset token not found')
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Reset token incorect or expired'
                })
            }
            log.info('Token found')
            res.cookie(
                'userId',
                resetPasswordRecord.userId,
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: expire_in_ms['1hour'],
                    sameSite: 'none'
                })

            const redirectUrl = resetPasswordRecord.clientUrl.toString() +
                config.get('resetPasswordClientUrl') +
                '/' +
                token

            return res.redirect(redirectUrl)


        } catch (e: Error | any) {
            log.error(`Error ${e?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e?.message}`,
            });
        }

    }
)




export default resetPasswordLinkRouter