import { User } from '../db/types';
import session from 'express-session';
import { randomUUID } from 'crypto';
import passport from 'passport';
import express from 'express';

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: User;
    };
  }
}

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user });
  });
});

export const configureSession = (app: express.Express) => {
  app.use(
    session({
      secret: randomUUID(),
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.authenticate('session'));
};
