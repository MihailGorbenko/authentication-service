import { Request, Response, Router } from "express";
import Log from "../../utils/log";
import { body, validationResult } from "express-validator";
import { ResponceStatus } from "../responce_status";
import allowedEmail from "../../middleware/userRegistred";
import { Error } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import config from "config";
import RefreshToken from "../../models/RefreshToken";

const loginRouter = Router();
const log = new Log("Route: /login");

loginRouter.post(
    "/",
    [allowedEmail, body("password", "bad password").isLength({ min: 5 })],
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
            const refreshToken = JWT.sign({}, config.get("jwtSecret"), {});

            const RTRecord = new RefreshToken({token: refreshToken});
            //// Recording refresh token
            RTRecord.save().then(
                (onfullfiled) => {
                    log.info("Refresh token saved");
                },
                (onrejected) => {
                    log.error("Error saving refresh token");
                    return res.status(ResponceStatus.StorageError).json({
                        message: "Error saving refresh token",
                    });
                }
            );
            ///////////////
            return res.status(ResponceStatus.Success).json({
                accessToken: JSON.stringify(accessToken),
                refreshToken: JSON.stringify(refreshToken),
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
