import passport from "passport";

// Handle the redirect after successful authentication
const handleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, token) => {
    if (err) {
      // Handle the authentication error
      return next(err);
    }
    // Redirect or send a response with the token
    res.json({ token });
  })(req, res, next);
};

export { handleAuthCallback };
