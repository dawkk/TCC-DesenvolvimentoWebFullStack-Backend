import express from "express";
import passport from "../middlewares/oAuth.js";


const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const redirectUrl = process.env.OAUTH_REDIRECT_URL;
  res.cookie('jwt', req.user, {
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
  });
  return res.redirect(redirectUrl);
});


router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  const redirectUrl = process.env.OAUTH_REDIRECT_URL;
  res.cookie('jwt', req.user, {
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
  });
  return res.redirect(redirectUrl);
});

export default router;
