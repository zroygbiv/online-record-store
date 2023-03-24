import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// reach into existing type def and modify it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // if no session or no session jwt set
  if (!req.session?.jwt) {
    return next();
  }   
  // decode JWT
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};