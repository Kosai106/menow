import * as React from 'react';

import { Status, User } from '../../../shared/types';
import { ProfilePage } from '../../../src/pages/ProfilePage';

interface Props {
    pathContext: {
        statuses: Status[];
        user: User;
    }
}

export default class MeNowProfilePage extends React.Component<Props> {
    render() {
        return <ProfilePage {...this.props.pathContext}/>;
    }
}
