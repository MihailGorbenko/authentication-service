import { IServiceUser } from "../../models/ServiceUser";
import { Document, Types } from "mongoose";
import { DB } from "../../storage/database";
import { ServiceUserRecord } from "../../types/databaseRecords";

export { }

declare global {
  namespace Express {
    export interface Request {
      user: ServiceUserRecord,
      database: DB,
      jwtSecret: String 

    }
  }
}

