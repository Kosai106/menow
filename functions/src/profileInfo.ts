import * as functions from 'firebase-functions';

import { ProfileInfoArgs, ProfileInfoReturn } from '../../shared/functions';
import { Status, User } from '../../shared/types';

import { firestore } from './util/firestore';

const handler = async (data: ProfileInfoArgs): Promise<ProfileInfoReturn> => {
  const users = await firestore
    .collection('users')
    .where('slug', '==', data.username)
    .limit(1)
    .get();

  if (users.empty) {
    return null;
  }

  const user = users.docs[0];

  const statuses = await user.ref
    .collection('current_status')
    .where('public', '==', true)
    .get();

  return {
    user: user.data() as User,
    statuses: statuses.docs.map(s => s.data()) as Status[],
  };
};

export const profileInfo = functions.https.onCall(handler);
