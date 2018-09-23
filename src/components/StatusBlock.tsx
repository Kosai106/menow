import * as React from "react";

import { Status } from "../../shared/types";

import './StatusBlock.css';

interface StatusProps {
    status: Status;
}

export default class StatusBlock extends React.Component<StatusProps> {
    render() {
        return (
            <div className="status">
                <h2>{this.props.status.icon}</h2>
                <div className="text">
                    <h3>{this.props.status.text}</h3>
                    {this.props.status.link
                        ? <a href={this.props.status.link} rel="nofollow" target="_blank" style={{color: this.props.status.color || 'rgb(0, 111, 197)'}}>{this.props.status.link_text || 'Learn more...'}</a>
                        : null}
                </div>
            </div>
        )
    }
}