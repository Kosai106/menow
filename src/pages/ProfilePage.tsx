import classNames from 'classnames';
import * as React from 'react';
import Helmet from 'react-helmet';
import { match } from 'react-router';

import { Status, User } from '../../shared/types';
import StatusBlock from '../components/StatusBlock';
import * as defaultData from '../util/default-data';
import { getProfileInfo } from '../util/firebase/functions';

import './ProfilePage.css'

interface PageBodyProps {
  isLoading: boolean;
  statuses: Status[];
  user: User;

  onAddFriend?: React.MouseEventHandler;
  onLogin?: React.MouseEventHandler;
}

export interface ProfilePageProps {
  match: match<{ username: string }>;
}

interface ProfilePageState {
  isLoading: boolean;
  statuses: Status[];
  user: User;
}

const Body: React.SFC<PageBodyProps> = ({ onAddFriend, statuses, user, isLoading }) => (
  <>
    <Helmet>
      <title>See what {user.name} is doing - MeNow</title>
    </Helmet>

    <div className={classNames("page profile", { 'loading': isLoading })}>
      <header>
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
  private static defaultState = {
    isLoading: true,
    statuses: defaultData.statuses,
    user: defaultData.user,
  };

  private unsubscribeFirestore: (() => void)[] = [];

  constructor(props: ProfilePageProps) {
    super(props);

    this.onAddFriend = this.onAddFriend.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.state = ProfilePage.defaultState;
  }

  componentDidMount() {
    /*
     * We first load the data through a cloud function to reduce initial latency.
     * Then we dynamically load Firestore and attach our real-time listeners.
     */

    this.prefetchData();
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
        onAddFriend={this.onAddFriend}
        onLogin={this.onLogin}
        {...this.state}
      />
    );
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

  private onAddFriend(ev: React.MouseEvent) {
    // TODO: Implement add friend logic
  }

  private onLogin(ev: React.MouseEvent) {
    // TODO: Implement login logic
  }
}
