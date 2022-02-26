import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import config from '../misc/config';
import fetch from 'node-fetch';
import { saveUser } from '../db/db';

passport.use(
  'twitch',
  new OAuth2Strategy(
    {
      sessionKey: 'twitch',
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize?force_verify=true',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      clientID: config.twitch.client,
      clientSecret: config.twitch.secret,
      callbackURL: 'http://localhost:3000/auth/twitch/callback',
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      let result = await fetch(`https://id.twitch.tv/oauth2/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const res: { sub: string; preferred_username: string } = await result.json();

      let user = await saveUser({
        name: res.preferred_username,
        twitchId: res.sub,
      });

      return cb(null, user);
    }
  )
);
