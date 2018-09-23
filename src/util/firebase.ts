import * as fb from 'firebase/app';
import 'firebase/firestore';

import config from '../firebase-config';

export const firebase = fb.initializeApp(config);
export const firestore = fb.firestore();
firestore.settings({ timestampsInSnapshots: true });
