/// <reference path='../../typings/tsd.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fitjs from 'fit.js';

import Tile from './Tile';
import Timer from './Timer';
import DigitalDisplay from './DigitalDisplay';
import Dude from './Dude';
import Game from '../Game/index';

interface Props extends React.Props<Minesweeper> {
  initialWidth: number;
  initialHeight: number;
  initialMines: number;
}

interface State {
  game?: Game;
  mouseDown?: boolean;
}

class Minesweeper extends React.Component<Props, State> {

  autoresize: FitJSTransform;

  static Game = Game;

  constructor(props) {
    super(props);

    this.state = {
      // game: new Game(30, 16, 5),
      game: new Game(this.props.initialWidth, this.props.initialHeight, this.props.initialMines),
      mouseDown: false,
    };
  }

  componentDidMount(): void {
    const main = ReactDOM.findDOMNode(this.refs['main']);
    this.autoresize = fitjs(main, main.parentElement, { watch: true });
  }

  componentWillUnmount(): void {
    this.autoresize.off();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !(
      nextState.mouseDown === this.state.mouseDown
    );
  }

  clickTile(index: number, evt: React.MouseEvent): void {
    // console.log('leftclick', index);
    // const start = performance.now();
    this.state.game.revealTile(index);
    // console.log(performance.now() - start);
    this.forceUpdate();
  }

  doubleClickTile(index: number, evt: React.MouseEvent): void {
    evt.stopPropagation();
    // console.log('doubleclick', index);
    this.state.game.revealSurrounding(index);
    this.forceUpdate();
  }

  rightClickTile(index: number, evt: React.MouseEvent): void {
    evt.stopPropagation();
    // console.log('rightclick', index);
    this.state.game.toggleMarkTile(index);
    this.forceUpdate();
  }

  restart(evt: React.MouseEvent): void {
    this.state.game.setup();
    this.forceUpdate();
  }

  render(): JSX.Element {
    const {game} = this.state;

    let face;
    if (game.state === Game.State.RUNNING || game.state === Game.State.PREGAME) {
      if (this.state.mouseDown) {
        face = Dude.Faces.pressed;
      }
      else {
        face = Dude.Faces.default;
      }
    }
    else if (game.state === Game.State.WIN) {
      face = Dude.Faces.win;
    }
    else {
      face = Dude.Faces.dead;
    }

    return (
      <div className='ms-minesweeper' ref='main'>
        <div className='ms-top'>
          <DigitalDisplay digits={3} number={game.mines - game.marked_tiles} />
          <Timer start={game.time} running={game.state === Game.State.RUNNING} />
          <Dude face={face} onClick={this.restart.bind(this)} />
        </div>
        <div className='ms-board' style={{width: game.width * 16}}
          onMouseDown={(e) => { if (e.button === 0) this.setState({ mouseDown: true })}}
          onMouseUp={() => this.setState({ mouseDown: false })}
          onMouseLeave={() => this.setState({ mouseDown: false })} >
          {game.tiles.map((tile, i) => {
            return (
              <Tile key={i} state={tile.state} value={tile.value}
                onLeftClick={this.clickTile.bind(this, i)}
                onDoubleClick={this.doubleClickTile.bind(this, i)}
                onRightClick={this.rightClickTile.bind(this, i)} />
            );
          })}
        </div>
      </div>
    );
  }
}

module Minesweeper {
  export enum State {
    OVER,
    RUNNING,
    WAITING,
  }
}

export default Minesweeper;
