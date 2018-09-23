import * as React from 'react';

import { Status, User } from '../../shared/types';
import StatusBlock from '../components/StatusBlock';

import './ProfilePage.css'

export interface ProfileProps {
  user: User;
  statuses: Status[];
}

export const ProfilePage: React.SFC<ProfileProps> = ({user, statuses}) => (
  <div className="page profile">
    <header>
      <div className="bio">
        <img src={user.profile_image} />

        <div className="description">
          <div className="name">
            <h1>{user.name}</h1>
            <button>Add as friend</button>
          </div>
          <p>{user.bio}</p>
          {user.url ? <a href={user.url} target="_blank" rel="nofollow">{user.url}</a> : null}
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
)