import classNames from 'classnames';
import * as React from 'react';
import FirebaseUi from 'react-firebaseui/StyledFirebaseAuth';

import { firebase, firebaseNS } from '../util/firebase/app';
import '../util/firebase/auth';

import asModal from './Modal';

import './LoginModal.css';

interface LoginModalProps {
  className?: string;
  headerText?: string;

  onRequestClose?: () => void;
}

const fbUiConfig = {
  signInFlow: 'redirect',
  signInOptions: [
    firebaseNS.auth.GoogleAuthProvider.PROVIDER_ID,
    firebaseNS.auth.FacebookAuthProvider.PROVIDER_ID,
    firebaseNS.auth.TwitterAuthProvider.PROVIDER_ID,
    firebaseNS.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/',
};

const FirebaseModal: React.SFC<LoginModalProps> = (props) => (
  <div className={classNames('login', props.className)}>
    <h1>{props.headerText || "Sign In"}</h1>

    <FirebaseUi
      uiConfig={fbUiConfig}
      firebaseAuth={firebase.auth()}
    />

    <button
      className="btn-cancel"
      onClick={props.onRequestClose}
    >
      Cancel
    </button>
  </div>
);

export default asModal(FirebaseModal);
