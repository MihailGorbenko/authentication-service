import { Request, Response, Router } from "express";
import { ResponceStatus } from "../../../types/responce_status";
import Log from "../../../utils/log";
const log = new Log('Route: /resetPasswordLink')
import config from 'config'
import { expressCspHeader } from "express-csp-header";



const resetPasswordLinkRouter = Router()

resetPasswordLinkRouter.get(
    '/:token',
    [
        expressCspHeader({
            directives: {
                'default-src': ['*']
            }
        })
    ],
    async (req: Request, res: Response) => {
        try {
            const token = req.params.token
            const database = req.database

            const resetPasswordRecord = await database.findRPToken(token, false)
            if (!resetPasswordRecord) {
                log.info('Reset token not found')
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Reset token incorect or expired',
                    predicate: 'TOKEN_EXP'
                })
            }
            log.info('Token found')

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