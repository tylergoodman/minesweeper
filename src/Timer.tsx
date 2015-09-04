/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';
import DigitalDisplay from './DigitalDisplay';

class Timer extends React.Component<Timer.Props, Timer.State> {

  interval: number;

  constructor(props) {
    super(props);

    this.state = {
      seconds: 0,
    };
  }

  componentWillReceiveProps(nextProps: Timer.Props): void {
    // if we're asked to be stopped
    if (nextProps.start === -1) {
      // if we're running, stop
      if (this.interval !== -1) {
        // stop running
        window.clearInterval(this.interval);
      }
    }
    // if we're asked to be running
    else {
      // if we're not running
      if (this.interval === -1) {
        // run
        window.setInterval(this.tick.bind(this));
      }
    }
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

module Timer {
  export interface Props {
    start: number;
  }
  export interface State {
    seconds: number;
  }
}

export default Timer;
