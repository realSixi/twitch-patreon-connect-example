import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import config from '../misc/config';
import fetch from 'node-fetch';

passport.use(
  'patreon',
  new OAuth2Strategy(
    {
      sessionKey: 'patreon',
      authorizationURL: 'https://www.patreon.com/oauth2/authorize',
      tokenURL: 'https://www.patreon.com/api/oauth2/token',
      clientID: config.patron.client,
      clientSecret: config.patron.secret,
      callbackURL: 'http://localhost:3000/auth/patreon/callback',
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      let result = await fetch(`https://www.patreon.com/api/oauth2/v2/identity`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data } = await result.json();
      return cb(null, { id: data.id, provider: 'patreon' });
    }
  )
);
