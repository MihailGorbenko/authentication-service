import { Request, Response, Router, urlencoded } from "express";
import Log from "../../../utils/log";
import userRegistred from '../../../middleware/userRegistred'
import { body, validationResult } from 'express-validator'
import { ResponceStatus } from "../../responce_status";
import ResetPasswordToken from "../../../models/ResetPasswordToken";
import config from 'config'
import sendEmail from "../../../utils/sendEmail";


const resetPasswordRouter = Router()
const log = new Log('Route: /resetPassword')

resetPasswordRouter.post(
    '/',
    [userRegistred],
    async (req: Request, res: Response) => {
        try {

            const user = req.user
            ///// Check user
            if (!user) {
                log.info(`User not registred`);
                return res.status(ResponceStatus.BadRequest).json({
                    message: "User not registred",
                    predicate: "NOT_EXIST",
                });
            }

            const clientUrl = req.headers.origin
        
            //// Check if token already exists
            let passwordToken = await ResetPasswordToken.findOne({ userId: user.id })

            if (!passwordToken) {
                log.info('Reset password token not found. Generating...')
                passwordToken = await new ResetPasswordToken({
                    userId: user.id,
                    token: crypto.randomUUID(),
                    clientUrl
                }).save()
            }

            const link = `${config.get('baseUrl')}/resetPasswordLink/${passwordToken.token}`
            const text = `Follow this link to reset password ${link}`
            const html = htmlEmailTemplate.replace('$link',link)
            await sendEmail(user.email.toString(),"Password reset",text,html)
            log.info(`Email sent to ${user.email}`)

            return res.status(ResponceStatus.Success).json({message:'Mail sent'})

        } catch (e: Error | any) {
            log.error(`Error ${e?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e?.message}`,
            });
        }

    }
)


const htmlEmailTemplate = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset password</title>
    <style type="text/css">
        body {
            text-align: center;
            background-color: rgba(128, 128, 128, 0.479);
            color: rgb(56, 56, 56);
            padding: 3% 30%;
        }
        #button{
            text-decoration: none;
            width: max-content;
            font-size: 2em;
            background-color: #198754;
            color: white;
            border: 1px solid #198754;
            border-radius: 5px;
            padding: 0.15em 2em;
            box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.411);
        }
    </style>
</head>
<body>
    

    <h1>Reset password</h1>
    <h5>Click button below to continue</h5>
    <a href="$link" id="button">Reset</a>
  
</body>
</html>`

export default resetPasswordRouter