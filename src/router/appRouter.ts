import { Router } from "express";
import registerRouter from "./endpoints/auth/register";
import loginRouter from "./endpoints/auth/login";
import checkEmailRouter from "./endpoints/auth/check_email";
import refreshTokenRouter from "./endpoints/auth/refresh_token";

const serviceRouter = Router();
serviceRouter
    .use("/register", registerRouter)
    .use("/login", loginRouter)
    .use('/checkEmail',checkEmailRouter)
    .use('/refreshToken',refreshTokenRouter)

export default serviceRouter;
