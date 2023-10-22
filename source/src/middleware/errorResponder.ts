import { NextFunction, Request, Response } from "express";

export function errorResponder(error: any, req: Request, res: Response, next: NextFunction) {
  const errorCode = error.code ? error.code : 500;
  const message = error.message ? error.message : "Server error occurred";

  res.status(errorCode).send(message);
}
