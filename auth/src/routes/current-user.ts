import express from 'express';

import { currentUser } from '@zroygbiv-ors/sharedcode'

const router = express.Router();

// pass in middleware current user and require authorization
router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };