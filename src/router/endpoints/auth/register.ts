import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import config from "config";
import Log from "../../../utils/log";
import ServiceUser from "../../../models/ServiceUser";
import { ResponceStatus } from "../../../types/responce_status";
import { Router } from "express";
import allowedEmail from "../../../middleware/userRegistred";

const registerRouter = Router();
const log = new Log("Route: /register");

registerRouter.post(
  "/",
  [
    allowedEmail,
    body("password", "bad password").isString().isLength({ min: 5 }),
  ],
  async (req: Request, res: Response) => {

    try {
      ///// Validating request params
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(ResponceStatus.BadRequest).json({
          message: "Incorect credentials",
          predicate: "INCORECT",
          errors: errors.array(),
        });
      }
      //////////////////////////////////////////

      const { email, password } = req.body;
      const database = req.database

      ///// Check email 
      if (req.user) {
        log.info(`User ${email} already exists`);
        return res.status(ResponceStatus.BadRequest).json({
          message: "User already registred",
          predicate: "EXIST",
        });
      }

      //// Create new service user
      log.info(`Creating service user ${email}`);

      const userId = await database.addServiceUser({ email, password })

      return res.status(ResponceStatus.Success).json({
        message: 'User registred successfully',
        userId
      })


      ////////////////////////////////////////////
    } catch (e: Error | any) {
      log.error(`Error ${e?.message}`);
      return res.status(ResponceStatus.ServerError).json({
        message: `Server error ${e?.message}`,
      });
    }
  }
);

export default registerRouter;
