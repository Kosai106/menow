import * as firebase from 'firebase-admin';

import { defaultStatus, Status } from '../../../shared/types';
import { firestore } from '../util/firestore';

export const setOrUpdate = async (user: string, type: string, status: Partial<Status>) => {
  const { added = null, ...newStatus }: Partial<Status> = {
    ...defaultStatus,
    ...status,
    type,
    updated: firebase.firestore.Timestamp.now(),
  };

  const statusRef = firestore.collection('users')
    .doc(user)
    .collection('current_status')
    .doc(newStatus.type);

  const currentStatus = await statusRef.get();

  if (!currentStatus.exists) {
    await statusRef.set({
      ...newStatus,
      added: firebase.firestore.Timestamp.now(),
    });
  } else {
    await statusRef.update(newStatus);
  }

  return (await statusRef.get()).data();
};

export const unset = async (user: string, type: string, save: boolean) => {
  const statusRef = firestore.collection('users')
    .doc(user)
    .collection('current_status')
    .doc(type);

  const currentStatus = await statusRef.get();

  const batch = firestore.batch();
  batch.delete(statusRef);

  if (currentStatus.exists && (save || (save === undefined && currentStatus.data().save))) {
    const historyRef = firestore.collection('users')
      .doc(user)
      .collection('current_status')
      .doc();

    batch.set(historyRef, {
      ...currentStatus.data(),
      removed: firebase.firestore.Timestamp.now(),
    });

    return true;
  }

  return false;
};
