import { IServiceUser } from "../../models/ServiceUser";
import { Document,Types } from "mongoose";

export { }

declare global {
  namespace Express {
    export interface Request {
      user?: (Document<unknown, any, IServiceUser> & IServiceUser & {
        _id: Types.ObjectId;
      }) | null

    }
  }
}

