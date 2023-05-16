import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"],
      profileFields: ["name", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await users.findOne({ email: profile.emails[0].value }).exec();
        
        if (!user) {
          const randomPassword = generateRandomPassword();
          
          user = new users({
            firstName: profile.name.givenName,
            email: profile.emails[0].value,
            password: randomPassword,
            roles: {
              User: 4000,
            },
            addresses: [],
          });

          const salt = await bcrypt.genSalt(12);
          const passwordHash = await bcrypt.hash(randomPassword, salt);
          user.password = passwordHash;
          
          await user.save();
        }
        
        // Generate JWT token for the user
        const tokenPayload = {
          UserInfo: {
            id: user._id,
            roles: user.roles
          }
        };
        console.log('this is tokenPayload on oAuth', tokenPayload)
        const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        console.log('this is token on oAuth', token)
        done(null, token);
      } catch (err) {
        done(err);
      }
    }
  )
);

function generateRandomPassword() {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}


export default passport;
