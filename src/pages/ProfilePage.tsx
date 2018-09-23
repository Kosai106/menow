import classNames from 'classnames';
import * as React from 'react';
import { match } from 'react-router';

import { Status, User } from '../../shared/types';
import StatusBlock from '../components/StatusBlock';
import * as defaultData from '../util/default-data';
import { firestore } from '../util/firebase';

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
  <div className={classNames("page profile", {"loading": isLoading})}>
    <header>
      <div className="bio">
        <img src={user.profile_image} />

        <div className="description">
          <div className="name">
            <h1>{user.name}</h1>
            <button onClick={onAddFriend}>Add as friend</button>
          </div>
          <p>{user.bio}</p>
          {user.url
            ? <a href={user.url} target="_blank" rel="nofollow">{user.url}</a>
            : null}
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
);

export class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  private static defaultState = {
    isLoading: true,
    statuses: defaultData.statuses,
    user: defaultData.user,
  };

  private unsubscribeFirestore: () => void;

  constructor(props: ProfilePageProps) {
    super(props);

    this.onAddFriend = this.onAddFriend.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.state = ProfilePage.defaultState;
  }

  componentDidMount() {
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

  private async invalidateFirestore() {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
    }
    if (!this.props.match.params.username) {
      this.setState(ProfilePage.defaultState);
      return;
    }

    const users = await firestore.collection('users')
      .where('slug', '==', this.props.match.params.username)
      .limit(1)
      .get();

    if (users.empty) {
      alert(`User ${this.props.match.params.username} not found!`);
      return;
    }

    const userSnap = users.docs[0];

    this.setState({ user: userSnap.data() as User });
    this.unsubscribeFirestore = userSnap.ref
      .collection('current_status')
      .onSnapshot(statuses => {
        this.setState({
          isLoading: false,
          statuses: statuses.docs.map(status => status.data() as Status)
        });
      });
  }

  private onAddFriend(ev: React.MouseEvent) {
    // TODO: Implement add friend logic
  }

  private onLogin(ev: React.MouseEvent) {
    // TODO: Implement login logic
  }
}
