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
                    <h1>{user.name}</h1>
                    <p>{user.bio}</p>
                    {user.url ? <a href={user.url}>{user.url}</a> : null}
                </div>
            </div>
        </header>

        <div className="statuses">
            {statuses.map(status => <StatusBlock key={status.type} status={status} />)}
        </div>

        <footer>
            <a href="">MeNow</a>
        </footer>
    </div>
)