import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/user.js";

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


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
      userProfileURL: process.env.OAUTH_GOOGLE_USERPROFILEURL,
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
        const tokenPayload = {
          UserInfo: {
            id: user._id,
            roles: user.roles,
            email: user.email
          }
        };
      
        const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });

        done(null, token);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await users.findOne({ email: profile.emails[0].value }).exec();

        if (!user) {
          const randomPassword = generateRandomPassword();

          user = new users({
            firstName: profile.displayName,
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
        const tokenPayload = {
          UserInfo: {
            id: user._id,
            roles: user.roles,
            email: user.email,
          },
        };

        const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });

        done(null, token);
      } catch (err) {
        done(err);
      }
    }
  )
);




export default passport;
