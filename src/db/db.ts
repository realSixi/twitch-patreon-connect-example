import Datastore from 'nedb';
import { User } from './types';

const db = new Datastore({ inMemoryOnly: true });

export const findUserByTwitchId = (twitchId: string) =>
  new Promise<User>((resolve) => db.findOne({ twitchId: twitchId }, (err, user) => resolve(user as User)));

export const saveUser = (user: User) =>
  new Promise((resolve) => {
    db.insert(user, (err, document) => resolve(document));
  });

export const updateUser = (user: User) =>
  new Promise((resolve) => {
    db.update({ twitchId: user.twitchId }, user, {}, (err, numberOfUpdated) => resolve(true));
  });
