/// <reference path='../../typings/tsd.d.ts'/>

import * as React from 'react';
import * as _ from 'lodash';

import Game from '../Game/index';
import GameTile from '../Game/Tile';

export interface Props extends React.Props<Tile> {
  value?: number;
  state?: GameTile.State;
  onLeftClick?: (evt: React.MouseEvent) => any;
  onRightClick?: (evt: React.MouseEvent) => any;
  onDoubleClick?: (evt: React.MouseEvent) => any;
}

export interface State {
  mouseDown?: boolean;
}

export default class Tile extends React.Component<Props, State> {

  static defaultProps: Props = {
    value: 0,
    state: GameTile.State.DEFAULT,
    onLeftClick: () => null,
    onRightClick: () => null,
    onDoubleClick: () => null,
  }

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !(
      // we only care about mouseDown if we're in the DEFAULT state
      (nextState.mouseDown === this.state.mouseDown || this.props.state !== GameTile.State.DEFAULT) &&
      // changes in value are never seen by the player
      // (nextProps.value === this.props.value) &&
      (nextProps.state === this.props.state)
    );
  }

  onPressed(evt: React.MouseEvent): void {
    if (evt.buttons === 1 && this.props.state === GameTile.State.DEFAULT) {
      this.setState({ mouseDown: true });
    }
  }

  onUnPressed(evt: React.MouseEvent): void {
    this.setState({ mouseDown: false });
  }

  onClick(evt: React.MouseEvent): void {
    if (evt.button === 0 && this.props.state === GameTile.State.DEFAULT) {
      return this.props.onLeftClick(evt);
    }
    if (evt.button === 2) {
      return this.props.onRightClick(evt);
    }
  }

  render(): JSX.Element {
    // console.log('!rendering');
    const {
      state,
      value,
      onLeftClick,
      onDoubleClick,
      onRightClick,
    } = this.props;

    let classname;
    if (state === GameTile.State.REVEALED) {
      classname = `ms-revealed-${value}`;
    }
    else if (state === GameTile.State.REVEALED_EXPLODED) {
      classname = 'ms-revealed-bomb-exploded';
    }
    else if (state === GameTile.State.MARKED) {
      classname = 'ms-flagged';
    }
    else if (state === GameTile.State.MARKED_INCORRECT) {
      classname = 'ms-flagged-incorrect';
    }
    else {
      classname = 'ms-default';
      if (this.state.mouseDown) {
        classname += ' ms-pressed';
      }
    }

    return (
      <div
        draggable={false}

        onMouseUpCapture={this.onClick.bind(this)}
        onDoubleClick={onDoubleClick}
        onContextMenu={(e) => e.preventDefault()}

        onMouseDownCapture={this.onPressed.bind(this)}
        onMouseOverCapture={this.onPressed.bind(this)}
        onMouseOutCapture={this.onUnPressed.bind(this)}

        className={`ms-tile ${classname}`}
        />
    );
  }
}
