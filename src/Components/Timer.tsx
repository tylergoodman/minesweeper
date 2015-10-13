/// <reference path='../../typings/tsd.d.ts'/>

import * as React from 'react';
import DigitalDisplay from './DigitalDisplay';

interface Props extends React.Props<Timer> {
  start?: number;
  running?: boolean;
}

interface State {
  seconds?: number;
  interval?: number;
}

export default class Timer extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      interval: -1,
      seconds: 0,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !(
      nextProps.start === this.props.start &&
      nextProps.running === this.props.running &&
      nextState.seconds === this.state.seconds
    );
  }

  componentWillUnmount(): void {
    this.stop();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.running) {
      if (!this.props.running) {
        this.start(nextProps.start);
      }
    }
    else {
      this.stop();
    }
  }

  isTicking(): boolean {
    return this.state.interval !== -1;
  }

  start(start: number): void {
    // console.log('setting interval');
    this.setState({
      interval: setInterval(this.tick.bind(this), 1000),
      seconds: 0,
    });
  }

  stop(): void {
    // console.log('clearing interval');
    clearInterval(this.state.interval);
    this.setState({
      interval: -1,
    });
  }

  tick(): void {
    this.setState({
      seconds: Math.round((Date.now() - this.props.start) / 1000),
    });
  }

  render(): JSX.Element {
    // console.log('rendering');
    return (
      <DigitalDisplay digits={3} number={this.state.seconds} />
    );
  }
}
