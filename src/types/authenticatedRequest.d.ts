import { Request } from "express";
import { IUser } from "./user";
import { INote } from "./note";

export interface IAuthenticatedRequest extends Request {
  user?: IUser;
}
export interface INoteRequest extends IAuthenticatedRequest {
  note?: INote;
}
