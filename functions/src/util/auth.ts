import { firestore } from "./firestore";
import { User } from "./types";

export default async (req, res, next) => {
    const auth = async (userName: string, token: string) => {
        const user = await firestore.collection('users').doc(userName).get();

        if(!user.exists) {
            return {success: false, error: "User could not be found.", code: 404}
        }

        const userData = user.data() as User;

        if (userData.token !== token) {
            return {success: false, error: "User Token is invalid.", code: 401};
        }

        return {success: true};
    }

    const authResult = await auth(req.params.user || req.body.user, req.params.token || req.body.token);

    if(!authResult.success) {
        res.status(authResult.code).json(authResult);
    } else {
        next();
    }
};