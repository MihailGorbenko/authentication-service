import { Router } from "express";
import path from "path";
import registerRouter from "./endpoints/auth/register";
import loginRouter from "./endpoints/auth/login";
import checkEmailRouter from "./endpoints/auth/check_email";
import refreshTokenRouter from "./endpoints/auth/refresh_token";
import resetPasswordRouter from "./endpoints/resetPassword/reset_password";
import resetPasswordLinkRouter from "./endpoints/resetPassword/reset_password_link";
import setPasswordRouter from "./endpoints/resetPassword/set_password";
import addOriginRouter from "./endpoints/settings/addOrigin";
import allowedOriginsRouter from "./endpoints/settings/getAllowedOrigins";

const serviceRouter = Router();
serviceRouter
    .use("/register", registerRouter)
    .use("/login", loginRouter)
    .use('/checkEmail', checkEmailRouter)
    .use('/refreshToken', refreshTokenRouter)
    .use('/resetPassword', resetPasswordRouter)
    .use('/resetPasswordLink', resetPasswordLinkRouter)
    .use('/setPassword', setPasswordRouter)
    .use('/addOrigin', addOriginRouter)
    .use('/getAllowedOrigins', allowedOriginsRouter)
    .get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../public/index.html')))


export default serviceRouter;
