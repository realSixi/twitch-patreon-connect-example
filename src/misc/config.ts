import dotenv from 'dotenv';

dotenv.config();

const config = {
  patron: {
    client: process.env.PATREON_OAUTH_CLIENT as string,
    secret: process.env.PATREON_OAUTH_SECRET as string,
  },
  twitch: {
    client: process.env.TWITCH_OAUTH_CLIENT as string,
    secret: process.env.TWITCH_OAUTH_SECRET as string,
  },
};

export default config;
