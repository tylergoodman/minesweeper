/// <reference path='../typings/tsd.d.ts'/>

import './main.scss';
import * as React from 'react';
import Tile from './Tile';
import Timer from './Timer';
import DigitalDisplay from './DigitalDisplay';
import Dude from './Dude';
import Game from './Game/index';

interface Props {
  initialWidth: number;
  initialHeight: number;
  initialMines: number;
}

interface State {
  width: number;
  height: number;
  mines: number;
  time: number;
  state: GameState;
}

enum GameState {
  OVER,
  RUNNING,
  WAITING,
}

class Minesweeper extends React.Component<Props, State> {

  static Game = Game;

  static propTypes: {[index: string]: React.Requireable<any>} = {
    initialWidth: React.PropTypes.number,
    initialHeight: React.PropTypes.number,
    initialMines: React.PropTypes.number,
  }

  static defaultProps: Props = {
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
      state: GameState.WAITING,
    };
  }

  render(): JSX.Element {
    const tiles = [];
    for (let i = 0; i < this.state.width * this.state.height; i++) {
      tiles.push(<Tile />);
    }

    return (
      <div className='ms-minesweeper'>
        <DigitalDisplay digits={3} number={this.state.mines} />
        <Dude />
        <Timer start={Date.now()} />
        <div className='ms-board'>
          {tiles}
        </div>
      </div>
    );
  }
}

export = function MinesweeperFactory (element: Element, x?: number, y?: number, m?: number) {
  React.render((<Minesweeper initialWidth={x} initialHeight={y} initialMines={m} />), element);
}
