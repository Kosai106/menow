import * as React from 'react';
import './ProfilePage.css'

import { Status, User } from '../../shared/types';
import StatusBlock from '../components/StatusBlock';

import * as firebase from 'firebase';

export interface ProfileProps {
    user: User;
    statuses: Status[];
}

const statuses: Status[] = [{
    added: firebase.firestore.Timestamp.now(),
    color: '#1db954',
    type: 'status',
    updated: firebase.firestore.Timestamp.now(),

    icon: '🎧',
    link: 'https://open.spotify.com/user/leolabs/playlist/6zCmLKwSeeRb6OLdZ2Xf3i',
    link_text: 'Cinematic Work',
    priority: 1,
    public: true,
    save: true,
    text: 'Listening to Music',
  }, {
    added: firebase.firestore.Timestamp.now(),
    color: '#1db954',
    type: 'status',
    updated: firebase.firestore.Timestamp.now(),

    icon: '⛪️',
    link: 'https://aachen.digital',
    link_text: 'At digitalHub Aachen',
    priority: 1,
    public: true,
    save: true,
    text: 'Co-Working',
  }, {
    added: firebase.firestore.Timestamp.now(),
    color: '#1db954',
    type: 'status',
    updated: firebase.firestore.Timestamp.now(),

    icon: '🚀',
    link: 'https://open.spotify.com/user/leolabs/playlist/6zCmLKwSeeRb6OLdZ2Xf3i',
    link_text: 'In Visual Studio Code',
    priority: 1,
    public: true,
    save: true,
    text: 'Programming',
  }]

export const ProfilePage: React.SFC<ProfileProps> = ({user}) => (
    <div className="page profile">
        <header>Bio</header>

        <div className="statuses">
            {statuses.map(status => <StatusBlock key={status.type} status={status} />)}
        </div>
    </div>
)