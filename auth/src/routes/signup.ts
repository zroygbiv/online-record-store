import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@zroygbiv-ors/sharedcode';
import { User } from '../models/user';

const router = express.Router();

// using validator functionality
router.post('/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4-20 characters')
  ], 
  // middleware: POST check for errors
  validateRequest,
  async (req: Request, res: Response) => {
    // pull email/pw from request
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    // user already exists
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    
    // build new user
    const user = User.build({ email, password });
    // persist new user to MongoDB
    await user.save();

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      }, 
      // environment variable; ! lets TS know that it is defined (index.ts)
      process.env.JWT_KEY! 
    );

    // store JWT on session object
    req.session = {
      jwt: userJwt
    };

    // response with user info; status 201 record creation 
    res.status(201).send(user);
  }
);

// export route handler
export { router as signupRouter };