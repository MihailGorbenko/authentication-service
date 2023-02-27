import { Request, Response, Router } from "express";
import errors from "formidable/FormidableError";
import { Error } from "mongoose";
import RefreshToken from "../../../models/RefreshToken";
import Log from "../../../utils/log";
import { ResponceStatus } from "../../responce_status";
import JWT from 'jsonwebtoken'
import config from 'config'
import expire_in_ms from "../../expire_in_ms";


const refreshTokenRouter = Router()

const log = new Log('Route /refreshToken')


refreshTokenRouter.post(
    '/',
    async (req: Request, res: Response) => {

        try {
            const { refreshToken } = req.cookies
            

            if (!refreshToken) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: 'Refresh token missing',
                    predicate: 'MISSING_TOKEN'
                })
            }

            const tokenRecord = await RefreshToken.findOne({ token: refreshToken })
            if (!tokenRecord) {
                return res.status(ResponceStatus.NotAuthorized).json({
                    message: 'Refresh token not exists or already deprecated',
                    predicate: 'BAD_TOKEN'
                })
            }
            const { userId } = tokenRecord

            await tokenRecord.deleteOne()

            //// Genereting JWT pair
            const accessToken = JWT.sign(
                {
                    id: userId
                },
                config.get("jwtSecret"),
                {
                    expiresIn: "10m",
                }
            );
            const newRefreshToken = JWT.sign({}, config.get("jwtSecret"), {});

            const RTRecord = new RefreshToken({ token: newRefreshToken, userId });
            //// Recording refresh token
            await RTRecord.save()
            ///////////////
            res.cookie('refreshToken',
                newRefreshToken,
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: expire_in_ms['1month'],
                    sameSite: 'none',
                    path: '/refreshToken'
                })
            return res.status(ResponceStatus.Success).json({
                accessToken: JSON.stringify(accessToken),
            });




        } catch (e: Error | any) {
            log.error(`Error ${e?.message}`);
            return res.status(ResponceStatus.ServerError).json({
                message: `Server error ${e?.message}`,
            });
        }

    })

export default refreshTokenRouter


