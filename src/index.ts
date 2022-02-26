import express from 'express';
import path from 'path';
import passport from 'passport';
import './login/patreon';
import './login/twitch';
import { findUserByTwitchId, updateUser } from './db/db';
import { randomUUID } from 'crypto';
import { configureSession } from './session/session';

const app = express();

configureSession(app);

app.get('/', (req, res) => {
  if (req.session.passport?.user.twitchId) {
    return res.redirect('/patreon');
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/patreon', (req, res) => {
  if (!req.session.passport?.user.twitchId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/patreon.html'));
});

app.get('/done', async (req, res) => {
  if (req.session.passport?.user.twitchId) {
    let user = await findUserByTwitchId(req.session.passport?.user.twitchId);
    console.log(`User ${user.name} with TwitchID ${user.twitchId} has PatreonId ${user.patreonId}`);
    return res.sendFile(path.join(__dirname, '../public/done.html'));
  }
  res.redirect('/');
});

app.get(
  '/login/patreon',
  passport.authenticate(
    'patreon',
    {
      scope: 'identity',
      state: randomUUID(),
    },
    (cb) => {
      console.log('Patreon callback!', cb);
    }
  )
);

app.get('/auth/patreon/callback', (req, res, next) => {
  passport.authenticate('patreon', async (err, user, info, status) => {
    if (req.session.passport?.user.twitchId) {
      let dbUser = await findUserByTwitchId(req.session.passport?.user.twitchId);
      dbUser.patreonId = user.id;
      await updateUser(dbUser);
    }

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    res.redirect('/done');
  })(req, res, next);
});

app.get('/login/twitch', passport.authenticate('twitch', { state: randomUUID() }));

app.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/patreon');
});

app.listen(3000);
