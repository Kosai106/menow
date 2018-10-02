import classNames from 'classnames';
import * as React from 'react';
import Helmet from 'react-helmet';
import * as Loadable from 'react-loadable';
import { match } from 'react-router';

import { Status, User } from '../../shared/types';
import StatusBlock from '../components/StatusBlock';
import * as defaultData from '../util/default-data';
import { getProfileInfo } from '../util/firebase/functions';

import './ProfilePage.css'

interface PageBodyProps extends ProfilePageState {
  onAddFriend?: React.MouseEventHandler;
  onGoToDashboard?: React.MouseEventHandler;
  onLogin?: React.MouseEventHandler;
  onRequestLoginModalClose?: () => void;
  onSignup?: React.MouseEventHandler;
}

export interface ProfilePageProps {
  match: match<{ username: string }>;
}

interface ProfilePageState {
  authStateKnown: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  isSignedIn: boolean;
  loginModalTitle: string;
  statuses: Status[];
  user: User;
}

const LoginModal = Loadable({
  loader: () => import('../components/LoginModal'),
  loading: () => null,
});

const Body: React.SFC<PageBodyProps> = ({
  authStateKnown,
  isLoading,
  isLoginModalOpen,
  isSignedIn,
  loginModalTitle,
  onAddFriend,
  onGoToDashboard,
  onLogin,
  onRequestLoginModalClose,
  onSignup,
  statuses,
  user,
}) => (
  <>
    <Helmet>
      <title>See what {user.name} is doing - MeNow</title>
    </Helmet>

    <LoginModal
      headerText={loginModalTitle}
      isOpen={isLoginModalOpen}
      onRequestClose={onRequestLoginModalClose}
    />

    <div className={classNames("page profile", { 'loading': isLoading })}>
      <header>
        <div className={classNames('buttons', {visible: authStateKnown})}>
          {isSignedIn
            ? <button onClick={onGoToDashboard}>Dashboard</button>
            : (
              <>
                <button onClick={onLogin}>Login</button>
                <button onClick={onSignup}>Sign Up</button>
              </>
            )}
        </div>

        <div className="bio">
          <img src={user.profile_image} />

          <div className="description">
            <div className="name">
              <h1>{user.name}</h1>
              <button onClick={onAddFriend}>Add as friend</button>
            </div>
            <p>{user.bio}</p>
            <a
              href={user.url}
              target="_blank"
              rel="nofollow noopener"
            >
              {user.url || '\u200B' /* Zero width space to avoid plopping */}
            </a>
          </div>
        </div>
      </header>

      <div className="status-container">
        <h2>I am currently...</h2>
        <div className="statuses">
          {statuses.length
            ? statuses.map(status => <StatusBlock key={status.type} status={status} />)
            : <h3>No statuses set.</h3>}
        </div>
      </div>

      <footer>
        <a href="/">MeNow</a>
      </footer>
    </div>
  </>
);

export class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  private static defaultState: ProfilePageState = {
    authStateKnown: false,
    isLoading: true,
    isLoginModalOpen: false,
    isSignedIn: false,
    loginModalTitle: '',
    statuses: defaultData.statuses,
    user: defaultData.user,
  };

  private unsubscribeFirestore: (() => void)[] = [];

  constructor(props: ProfilePageProps) {
    super(props);

    this.state = ProfilePage.defaultState;
  }

  componentDidMount() {
    /*
     * We first load the data through a cloud function to reduce initial latency.
     * Then we dynamically load Firestore and attach our real-time listeners.
     */
    this.prefetchData();

    this.initializeAuth();
    this.invalidateFirestore();
  }

  componentDidUpdate(prevProps: Readonly<ProfilePageProps>) {
    if (this.props.match.params.username === prevProps.match.params.username) {
      return;
    }

    this.invalidateFirestore()
      .catch(alert);
  }

  render() {
    return (
      <Body
        {...this.state}
        onAddFriend={this.onAddFriend}
        onLogin={this.onLogin}
        onRequestLoginModalClose={this.onLoginModalClose}
        onSignup={this.onSignUp}
      />
    );
  }

  /**
   * Initializes the state based on whether there currently is somebody
   * signed in.
   */
  private async initializeAuth() {
    const { getUser } = await import('../util/firebase/auth');

    const user = await getUser();
    this.setState({
      authStateKnown: true,
      isSignedIn: !!user,
    });

    return user;
  }

  /**
   * Attach firestore listeners to the user data and statuses and
   * update the component state on changes.
   */
  private async invalidateFirestore() {
    this.unsubscribeFirestore.forEach(fn => fn());
    this.unsubscribeFirestore = [];

    if (!this.props.match.params.username) {
      this.setState(ProfilePage.defaultState);
      return;
    }

    const { firestore } = await import('../util/firebase/firestore');

    const uslug = this.props.match.params.username;
    const users = await firestore.collection('users')
      .where('slug', '==', uslug)
      .limit(1)
      .get();

    if (users.empty) {
      alert(`User ${uslug} not found!`);
      return;
    }

    const userSnap = users.docs[0];

    const unsubUser = userSnap.ref
      .onSnapshot(snap => this.setState({
        isLoading: false,
        user: snap.data() as User,
      }));
    const unsubStatus = userSnap.ref
      .collection('current_status')
      .onSnapshot(statuses => this.setState({
        isLoading: false,
        statuses: statuses.docs.map(status => status.data() as Status)
      }));

    this.unsubscribeFirestore.push(unsubUser, unsubStatus);
  }

  /**
   * Fetch profile data through a cloud function instead of going through firestore
   * to reduce initial latency.
   */
  private async prefetchData() {
    const { data } = await getProfileInfo({ username: this.props.match.params.username });

    if (!data) {
      return;
    }

    this.setState(prevState => {
      // If we actually are behind firestore, do nothing as Firestore's data is
      // probably more up-to-date.
      if (!prevState.isLoading) {
        return null;
      }

      return { ...data, isLoading: false };
    });
  }

  private onAddFriend = (ev: React.MouseEvent) => {
    // TODO: Implement add friend logic
  }

  private onLogin = (ev: React.MouseEvent) => {
    this.setState({
      isLoginModalOpen: true,
      loginModalTitle: "Log In",
    });
  }

  private onLoginModalClose = () => {
    this.setState({ isLoginModalOpen: false });
  }

  private onSignUp = (ev: React.MouseEvent) => {
    this.setState({
      isLoginModalOpen: true,
      loginModalTitle: "Sign Up",
    });
  }
}
