import classNames from 'classnames';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import './Modal.css';

export interface ModalProps extends WrappedComponentProps {
  className?: string;
  isOpen: boolean;
}

export interface WrappedComponentProps {
  onRequestClose?: () => void;
}

export default function<T extends WrappedComponentProps>(Component: React.ComponentType<T>) {
  return class extends React.Component<ModalProps & T> {
    private el: HTMLDivElement;

    componentDidMount() {
      this.el = document.createElement('div');
      document.body.appendChild(this.el);
    }

    componentWillUnmount() {
      this.el.remove();
    }

    render() {
      if (!this.el) {
        return null;
      }

      const { isOpen, ...rest } = this.props as any;

      const dom = (
        <div
          className={classNames(
            "modal",
            { open: this.props.isOpen },
          )}
          onKeyPress={this.handleKeyPress}
        >
          <div
            className="backdrop"
            onClick={this.props.onRequestClose}
          />

          <div className="body">
            <Component {...rest}/>
          </div>
        </div>
      );

      return ReactDom.createPortal(dom, this.el);
    }

    private handleKeyPress = (ev: React.KeyboardEvent) => {
      if (ev.keyCode === 27 && this.props.onRequestClose) {
        this.props.onRequestClose();
      }
    }
  }
}
