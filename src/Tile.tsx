/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';

/**
possible states:
  revealed
    bomb
    0-8
  concealed
    blank
    flag
*/

class Tile extends React.Component<Tile.Props, Tile.State> {

  static PropTypes: {[index: string]: React.Requireable<any>} = {
    value: React.PropTypes.string,
  }

  static defaultProps: Tile.Props = {
    value: '0',
  }

  constructor(props) {
    super(props);

    this.state = {
      game: Tile.GameState.DEFAULT
    };
  }

  render(): JSX.Element {
    let state;

    if (this.state.game === Tile.GameState.REVEALED) {
      state = `ms-revealed-${this.props.value}`;
    }
    else if (this.state.game === Tile.GameState.FLAGGED) {
      state = 'ms-flagged';
    }
    else {
      state = 'ms-default';
    }
    return (<span className={'ms-tile ' + state}></span>);
  }
}

module Tile {
  export interface Props {
    value?: string;
  }
  export interface State {
    game: GameState;
  }
  export enum GameState {
    DEFAULT,
    REVEALED,
    FLAGGED,
  }
}


export default Tile;
