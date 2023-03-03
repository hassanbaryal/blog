import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const initializePassport = (passport: any) => {
  passport.use(
    new Strategy((username, password, done) => {
      User.findOne({ username }).exec((err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username' });
        return bcrypt.compare(password, user.password, (error, res) => {
          // Passwords match
          if (res) return done(null, user);
          // Passwords do not match
          return done(null, false, { message: 'Incorrect password' });
        });
      });
    })
  );
};

export default initializePassport;
