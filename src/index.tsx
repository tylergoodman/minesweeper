/// <reference path='../typings/tsd.d.ts'/>

import './styles.scss';
import * as React from 'react';
import Tile from './Tile';
import Timer from './Timer';
import DigitalDisplay from './DigitalDisplay';

class Minesweeper extends React.Component<Minesweeper.Props, Minesweeper.State> {

  static propTypes: {[index: string]: React.Requireable<any>} = {
    initialWidth: React.PropTypes.number,
    initialHeight: React.PropTypes.number,
    initialMines: React.PropTypes.number,
  }

  static defaultProps: Minesweeper.Props = {
    // initialWidth: 30,
    // initialHeight: 16,
    initialWidth: 10,
    initialHeight: 10,
    initialMines: 99,
  }

  constructor(props) {
    super(props);

    this.state = {
      width: this.props.initialWidth,
      height: this.props.initialHeight,
      mines: this.props.initialMines,
      time: 0,
      state: Minesweeper.GameState.WAITING,
    };
  }

  render(): JSX.Element {
    // const tiles = [];
    // for (let i = 0; i < this.state.width * this.state.height; i++) {
    //   tiles.push(<Tile />);
    // }

        // <Timer start={-1} />
        // <Timer start={Date.now()} />

    return (
      <div className='ms-minesweeper'>
        <DigitalDisplay digits={10} number={1234567890}/>
      </div>
    );
  }
}

module Minesweeper {

  export interface Props {
    initialWidth: number;
    initialHeight: number;
    initialMines: number;
  }

  export interface State {
    width: number;
    height: number;
    mines: number;
    time: number;
    state: GameState;
  }

  export enum GameState {
    OVER,
    RUNNING,
    WAITING,
  }
}

export = function MinesweeperFactory (element: Element, x?: number, y?: number, m?: number) {
  React.render((<Minesweeper initialWidth={x} initialHeight={y} initialMines={m} />), element);
}
