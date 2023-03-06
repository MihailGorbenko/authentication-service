import { Request, Response, Router } from "express";
import Log from "../../../utils/log";
import { body, validationResult } from "express-validator";
import { ResponceStatus } from "../../../types/responce_status";
import userRegistred from "../../../middleware/userRegistred";
import { Error } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import config from "config";
import RefreshToken from "../../../models/RefreshToken";
import expire_in_ms from "../../../types/expire_in_ms";

const loginRouter = Router();
const log = new Log("Route: /login");

loginRouter.post(
    "/",
    [userRegistred, body("password", "bad password").isLength({ min: 5 }).isString()],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            ///// Validating request params
            if (!errors.isEmpty()) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: "Incorect credentials",
                    predicate: "INCORRECT",
                    errors: errors.array(),
                });
            }
            ///////////////////////////////
            const { email, password } = req.body;
            const user = req.user;
            const database = req.database
            ///// Check user
            if (!user) {
                log.info(`User ${email} not registred`);
                return res.status(ResponceStatus.BadRequest).json({
                    message: "User not registred",
                    predicate: "NOT_EXIST",
                });
            }
            //// Matching password
            const passwordMatch = bcrypt.compareSync(
                password,
                user.password.toString()
            );
            if (!passwordMatch) {
                return res.status(ResponceStatus.BadRequest).json({
                    message: "Password incorect",
                    predicate: "PASS_INCORECT",
                });
            }
            ////////////////////////

            //// Genereting JWT pair
            const accessToken = JWT.sign(
                {
                    id: user.id,
                },
                config.get("jwtSecret"),
                {
                    expiresIn: "10m",
                }
            );
            /// Check if an old refresh token exist
            await database.findRefrTokenByUserId(user.id, true)
            /////////////////
            const refreshToken = await database.createNewRefrToken(user.id)
            
            res.cookie('refreshToken',
                refreshToken,
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
    }
);

export default loginRouter;
