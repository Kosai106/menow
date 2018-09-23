import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';

import { setOrUpdate, unset } from './model/status';
import { auth } from './util/auth';
import { handlify } from './util/handlify';

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/:user/:token/:type/set', auth, handlify(async (req: express.Request, res: express.Response) => {
  const { user, type } = req.params;
  return res.json({ newStatus: (await setOrUpdate(user, type, req.query)) });
}));

app.post('/:user/:token/:type/set', auth, handlify(async (req: express.Request, res: express.Response) => {
  const { user, type, ...status } = req.body;
  return res.json({ newStatus: (await setOrUpdate(user, type, status)) });
}));

app.get('/:user/:token/:type/unset', auth, handlify(async (req: express.Request, res: express.Response) => {
  const { user, type } = req.params;
  await unset(user, type, req.query.save);
  return res.status(204).send();
}));

app.post('/:user/:token/:type/unset', auth, handlify(async (req: express.Request, res: express.Response) => {
  const { user, type, save } = req.body;
  await unset(user, type, save);
  return res.status(204).send();
}));

export const hook = functions.https.onRequest(app);
