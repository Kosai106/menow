import * as basicAuth from 'basic-auth';
import * as express from 'express';

import { User } from "../../../shared/types";

import { firestore } from "./firestore";
import { handlify } from './handlify';

const verifyToken = async (uid: string, token: string): Promise<[number, any]> => {
    const user = await firestore.collection('users')
        .doc(uid)
        .get();

    if (!user.exists) {
        return [404, { error: "User could not be found." }];
    }

    const userData = user.data() as User;

    if (userData.token !== token) {
        return [401, { error: "User Token is invalid." }];
    }

    return [204, {}];
};

export const auth = handlify(async (req: express.Request, res: express.Response, next) => {
    const authResult = basicAuth(req);
    const [code, response] = await verifyToken(
        req.params.user || (authResult && authResult.name) || req.body.user,
        req.params.token || (authResult && authResult.pass) || req.body.token,
    );

    if (code >= 200 && code < 300) {
        next();
    } else {
        res.status(code).json(response);
    }
});
