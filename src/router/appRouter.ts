import { Router } from "express";
import registerRouter from "./endpoints/auth/register";
import loginRouter from "./endpoints/auth/login";
import checkEmailRouter from "./endpoints/auth/check_email";
import refreshTokenRouter from "./endpoints/auth/refresh_token";
import resetPasswordRouter from "./endpoints/resetPassword/reset_password";
import resetPasswordLinkRouter from "./endpoints/resetPassword/reset_password_link";
import setPasswordRouter from "./endpoints/resetPassword/set_password";

const serviceRouter = Router();
serviceRouter
    .use("/register", registerRouter)
    .use("/login", loginRouter)
    .use('/checkEmail', checkEmailRouter)
    .use('/refreshToken', refreshTokenRouter)
    .use('/resetPassword', resetPasswordRouter)
    .use('/resetPasswordLink', resetPasswordLinkRouter)
    .use('/setPassword',setPasswordRouter)
    .get("/:universalURL", (req, res) => {
        res.send("404 URL NOT FOUND");
    });

export default serviceRouter;
