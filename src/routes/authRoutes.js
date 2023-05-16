import express from "express";
import passport from "../middlewares/oAuth.js";

const router = express.Router();

// Routes for Google OAuth

// Redirect the user to the Google OAuth authentication URL
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the callback from Google OAuth after the user has granted access
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Handle the authenticated user data
  // Here, you can generate a JWT token or create a session for the user
  // Redirect the user to the desired page or send a response with the token/session information
  res.send('Google OAuth callback successful');
});

export default router;
