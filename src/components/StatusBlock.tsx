import classNames from 'classnames';
import * as React from "react";

import { Status } from "../../shared/types";

import './StatusBlock.css';

interface StatusProps {
  className?: string;
  status: Status;
}

const StatusBlock: React.SFC<StatusProps> = props => (
  <div className={classNames(props.className, 'status')}>
    <h2>{props.status.icon}</h2>
    <div className="text">
      <h3>{props.status.text}</h3>

      {props.status.link &&
        <a
          href={props.status.link}
          rel="nofollow"
          target="_blank"
          style={{color: props.status.color || 'rgb(0, 111, 197)'}}
        >
          {props.status.link_text || 'Learn more...'}
        </a>}
    </div>
  </div>
);

export default StatusBlock;
