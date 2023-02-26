import { Router } from "express";
import registerRouter from "./endpoints/register";
import loginRouter from "./endpoints/login";
import checkEmailRouter from "./endpoints/check_email";

const serviceRouter = Router();
serviceRouter
    .use("/register", registerRouter)
    .use("/login", loginRouter)
    .use('/checkEmail',checkEmailRouter)

export default serviceRouter;
