import * as express from 'express';

import { User } from "../../../shared/types";

import { firestore } from "./firestore";

export default async (req: express.Request, res: express.Response, next) => {
    const auth = async (userName: string, token: string) => {
        const userMap = await firestore.collection('usernames').doc(userName).get();

        const user = await firestore.collection('users').doc(userMap.exists ? userMap.data().uid : userName).get();

        if (!user.exists) {
            return {success: false, error: "User could not be found.", code: 404};
        }

        const userData = user.data() as User;

        if (userData.token !== token) {
            return {success: false, error: "User Token is invalid.", code: 401};
        }

        return {success: true};
    };

    const [authMethod = null, authUser = null, authToken = null] = req.headers.authorization
        ? req.headers.authorization.split(" ")
        : [];

    const authResult = await auth(
        req.params.user || authUser || req.body.user,
        req.params.token || authToken || req.body.token,
    );

    if (!authResult.success) {
        res.status(authResult.code).json(authResult);
    } else {
        next();
    }
};
