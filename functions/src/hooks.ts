import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';

import { defaultStatus, Status } from '../../shared/types';

import auth from './util/auth';
import { firestore } from './util/firestore';

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(auth);

const setOrUpdate = async (user: string, type: string, status: Partial<Status>) => {
    const {added = null, ...newStatus}: Partial<Status> = {
        ...defaultStatus,
        ...status,
        type,
        updated: firebase.firestore.Timestamp.now(),
    };

    const statusRef = firestore
        .collection('users').doc(user)
        .collection('current_status').doc(newStatus.type);

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

const unset = async (user: string, type: string, save: boolean) => {
    const statusRef = firestore
        .collection('users').doc(user)
        .collection('current_status').doc(type);

    const currentStatus = await statusRef.get();

    const batch = firestore.batch();
    batch.delete(statusRef);

    if (currentStatus.exists && (save || (save === undefined && currentStatus.data().save))) {
        const historyRef = firestore
            .collection('users').doc(user)
            .collection('current_status').doc();

        batch.set(historyRef, {
            ...currentStatus.data(),
            removed: firebase.firestore.Timestamp.now(),
        });

        return true;
    }

    return false;
};

app.get('/:user/:token/:type/set', async (req: express.Request, res: express.Response) => {
    const {user, type} = req.params;
    return res.json({success: true, newStatus: (await setOrUpdate(user, type, req.query))});
});

app.post('/:user/:token/:type/set', async (req: express.Request, res: express.Response) => {
    const {user, type, ...status} = req.body;
    return res.json({success: true, newStatus: (await setOrUpdate(user, type, status))});
});

app.get('/:user/:token/:type/unset', async (req: express.Request, res: express.Response) => {
    const {user, type} = req.params;
    await unset(user, type, req.query.save);
    return res.json({success: true});
});

app.post('/:user/:token/:type/unset', async (req: express.Request, res: express.Response) => {
    const {user, type, save} = req.body;
    await unset(user, type, save);
    return res.json({success: true});
});

export const hook = functions.https.onRequest(app);
