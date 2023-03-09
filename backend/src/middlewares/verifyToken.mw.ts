import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "jwtsecret",
    },
    (jwtPayload: any, done: any) => {
      try {
        return done(null, jwtPayload);
      } catch (err) {
        return done(err);
      }
    }
  )
);
