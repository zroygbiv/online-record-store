import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordManager } from '../services/password';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@zroygbiv-ors/sharedcode';

const router = express.Router();

// using validator functionality
router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password') 
  ], 
  // middleware: POST check for errors
  validateRequest,
  async (req: Request, res: Response) => {
    // pull email/pw from request
    const { email, password } = req.body;
    // find existing user
    const existingUser = await User.findOne({ email });
    // if user doesn't exist; throw error
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    // check password match
    const passwordsMatch = await PasswordManager.compare(
      existingUser.password, password
    );
    // if invalid password; throw error
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      }, 
      // environment variable; ! lets TS know that it is defined (index.ts)
      process.env.JWT_KEY! 
    );

    // store JWT on session object
    req.session = {
      jwt: userJwt
    };

    // response with user info; status 200 request succeeded
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };