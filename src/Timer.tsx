/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';
import DigitalDisplay from './DigitalDisplay';


interface Props {
  start: number;
}
interface State {
  seconds: number;
}

export default class Timer extends React.Component<Props, State> {

  interval: number = -1;

  constructor(props) {
    super(props);

    this.state = {
      seconds: 0,
    };

    this.componentWillReceiveProps(this.props); // this doesn't happen on first render by default
  }

  componentWillReceiveProps(nextProps: Props): void {
    // if we're asked to be stopped
    if (nextProps.start === -1) {
      // if we're running, stop
      if (this.interval !== -1) {
        // stop running
        clearInterval(this.interval);
      }
    }
    // if we're asked to be running
    else {
      // if we're not running
      if (this.interval === -1) {
        // run
        this.interval = setInterval(this.tick.bind(this));
      }
    }
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
  }

  tick(): void {
    this.setState({
      seconds: Math.round((Date.now() - this.props.start) / 1000),
    });
  }

  render(): JSX.Element {
    return (
      <DigitalDisplay digits={3} number={this.state.seconds} />
    );
  }
}
