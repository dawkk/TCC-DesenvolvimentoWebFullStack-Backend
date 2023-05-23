import express from "express";
import passport from "../middlewares/oAuth.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const redirectUrl = process.env.FRONT_END_URL;
  res.cookie('jwt', req.user, {
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
  });
  return res.redirect(redirectUrl);
});

export default router;
