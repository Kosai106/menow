// tslint:disable:ordered-imports

import { firebase } from './app';
import 'firebase/functions';

import { ProfileInfoArgs, ProfileInfoReturn } from '../../../shared/functions';

export const getProfileInfo = firebase.functions().httpsCallable('profileInfo') as
    (arg: ProfileInfoArgs) => Promise<{ readonly data: ProfileInfoReturn }>;
