import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import ServiceUser from "../models/ServiceUser";
import { ResponceStatus } from "../router/responce_status";
import Log from "../utils/log";

const log = new Log("Middleware: allowedEmail");

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email: string = req.body?.email;

  if (email) {
    if (email.toLowerCase().match(emailRegex)) {
      try {
        const candidate = await ServiceUser.findOne({ email }).exec();

        if (candidate) {
          log.info("Email already exists");
          req.user = candidate
        }
        else {
          req.user = null
        }

        next();
      } catch (e: Error | any) {
        log.error(`Error ${e?.message}`);
        return res.status(ResponceStatus.StorageError).json({
          message: `Storage error ${e?.message}`,
        });
      }
    }
    else {
      return res.status(ResponceStatus.BadRequest).json({
        message: "Email incorect",
        predicate: "INCORRECT",
      });
    }

  }
  else {
    return res.status(ResponceStatus.BadRequest).json({
      message: "Email required",
      predicate: "EMPTY_EMAIL",
    });
  }

}
