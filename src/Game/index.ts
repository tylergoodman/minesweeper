/// <reference path='../../typings/tsd.d.ts'/>

import { shuffle } from 'lodash';
import Tile from './Tile';

class Minesweeper {

  width: number;
  height: number;
  mines: number;

  tiles: Tile[];

  time: number;
  duration: number;
  state: Minesweeper.State;

  marked_tiles: number;

  private _revealed_tiles: number; // used to track whether the game is over
  private _first_turn: boolean; // used to track whether its the first turn or not

  static Tile = Tile;
  // static State = GameState;

  constructor(width?: number, height?: number, mines?: number) {
    this.width = width || 30;
    this.height = height || 16;

    const num_tiles = this.width * this.height;
    this.mines = mines || Math.round(num_tiles * (0.00020822 * num_tiles + 0.10528));

    this.tiles = new Array(num_tiles)
    for (let i = 0; i < num_tiles; i++) {
      this.tiles[i] = new Tile;
    }

    this.setup();
  }

  setup(): void {
    this.state = Minesweeper.State.PREGAME;
    this.time = -1;
    this.marked_tiles = 0;

    this._revealed_tiles = 0;
    this._first_turn = true;

    this.tiles.length = this.width * this.height;
    for (let i = 0, len = this.tiles.length; i < len; i++) {
      this.tiles[i].state = Tile.State.DEFAULT;
    }
  }

  isOver(): boolean {
    return (
      (this.width * this.height - this._revealed_tiles === this.mines)
    );
  }

  toggleMarkTile(index: number): Minesweeper;
  toggleMarkTile(x: number, y: number): Minesweeper;
  toggleMarkTile(x: number, y?: number): Minesweeper {
    let tile;
    if (y === undefined) {
      tile = this.tiles[x];
    }
    else {
      tile = this.tiles[this._getIndex(x, y)];
    }

    if (tile.state === Tile.State.REVEALED) {
      return this;
    }

    if (this.state === Minesweeper.State.WIN || this.state === Minesweeper.State.LOSE) {
      return this;
    }

    if (tile.state === Tile.State.MARKED) {
      tile.state = Tile.State.DEFAULT
      this.marked_tiles--;
    }
    else {
      tile.state = Tile.State.MARKED;
      this.marked_tiles++;
    }
    return this;
  }

  revealTile(index: number): Minesweeper {
    // don't try to reveal a tile if the game is over
    if (this.state === Minesweeper.State.WIN || this.state === Minesweeper.State.LOSE) {
      return this;
    }

    // generate board around clicked tile if its the first turn
    if (this._first_turn) {
      this.time = Date.now();
      this._generateBoard(index);
      this.state = Minesweeper.State.RUNNING;
      this._first_turn = false;
    }

    let tile = this.tiles[index];
    // don't try to reveal a tile that's already revealed
    if (tile.state === Tile.State.REVEALED) {
      return this;
    }

    // flood fill reveal if revealed tile has 0 neighboring mines
    if (tile.value === 0) {
      this._floodFillReveal(index);
    }
    else {
      tile.state = Tile.State.REVEALED;
      this._revealed_tiles++;
    }

    // check win/lose condition
    if (tile.isBomb()) {
      this._setGameOver(Minesweeper.State.LOSE);
      tile.state = Tile.State.REVEALED_EXPLODED;
    }
    else {
      if (this.isOver()) {
        this._setGameOver(Minesweeper.State.WIN);
      }
    }

    return this;
  }

  revealSurrounding(index: number): Minesweeper {
    const tile = this.tiles[index];

    // do nothing if we're not in the REVEALED state
    if (tile.state !== Tile.State.REVEALED) {
      return this;
    }

    const neighbors = this.getAdjacentTiles(index);
    // do nothing if we don't have the correct amount of neighbors flagged
    const num_marked_neighbors = neighbors.filter((index) => this.tiles[index].state === Tile.State.MARKED).length;
    if (num_marked_neighbors !== tile.value) {
      return this;
    }

    // reveal neighbors
    for (let i = 0, len = neighbors.length; i < len; i++) {
      if (this.tiles[neighbors[i]].state === Tile.State.DEFAULT) {
        this.revealTile(neighbors[i]);
      }
    }

    return this;
  }

  private _floodFillReveal(index: number): void {
    const queue = [index];
    while (queue.length) {
      index = queue.pop();
      const tile = this.tiles[index];

      if (tile.state === Tile.State.DEFAULT) {
        tile.state = Tile.State.REVEALED;
        this._revealed_tiles++;

        if (tile.value === 0) {
          for (let i of this.getAdjacentTiles(index)) {
            const tile = this.tiles[i];
            if (tile.state === Tile.State.DEFAULT) {
              queue.push(i);
            }
          }
        }
      }
    }
  }

  private _setGameOver(endState: Minesweeper.State): Minesweeper {
    this.state = endState;
    this.duration = Date.now() - this.time;

    // reveal unmarked mines, show incorrectly marked mines
    for (let i = 0, len = this.width * this.height; i < len; i++) {
      const tile = this.tiles[i];
      if (tile.isBomb()) {
        if (endState === Minesweeper.State.WIN) {
          tile.state = Tile.State.MARKED;
        }
        else {
          if (tile.state !== Tile.State.MARKED) {
            tile.state = Tile.State.REVEALED;
          }
        }
      }
      else {
        if (tile.state === Tile.State.MARKED) {
          tile.state = Tile.State.MARKED_INCORRECT;
        }
      }
    }

    return this;
  }

  // TODO - optimize this somehow
  getAdjacentTiles(index: number): number[] {
    const adjacent_tiles = [];
    const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    const [x, y] = this._getCoordinates(index);
    for (let direction of directions) {
      const [
        direction_x,
        direction_y,
      ] = direction;
      const neighbor_x = x + direction_x;
      const neighbor_y = y + direction_y;
      if (this._isInBounds(neighbor_x, neighbor_y)) {
        adjacent_tiles.push(this._getIndex(neighbor_x, neighbor_y));
      }
    }
    return adjacent_tiles;
  }

  private _generateBoard(first_click_index: number): void {
    const num_tiles = this.width * this.height;

    // if we have the space for it, make the clicked tile and all it's neighbors safe to click
    let adjacent_tiles;
    // if we're completely full of mines, don't do any swapping
    if (this.mines === num_tiles) {
      adjacent_tiles = [];
    }
    else {
      adjacent_tiles = this.getAdjacentTiles(first_click_index);
      if (num_tiles - adjacent_tiles.length >= this.mines) {
        adjacent_tiles = adjacent_tiles.concat(first_click_index);
      }
      else {
        adjacent_tiles = [first_click_index];
      }
    }

    // make safe tiles
    const safe_tiles = this.tiles.slice(0, adjacent_tiles.length);
    for (let i = 0, len = safe_tiles.length; i < len; i++) {
      safe_tiles[i].value = 0;
    }

    // make rest of tiles
    let shuffled_tiles = this.tiles.slice(adjacent_tiles.length, this.tiles.length);
    for (let i = 0, len = num_tiles - adjacent_tiles.length; i < len; i++) {
      if (i < this.mines) {
        shuffled_tiles[i].value = -1;
      }
      else {
        shuffled_tiles[i].value = 0;
      }
    }
    // shuffle rest of tiles
    this.tiles = shuffle(shuffled_tiles);

    // TODO - actually make this random?
    // swap in safe tiles
    for (let i = 0, len = safe_tiles.length; i < len; i++) {
      this.tiles.push(safe_tiles[i]);
      this._swapTiles(this.tiles.length - 1, adjacent_tiles[i]);
    }

    // set tile values
    for (let i = 0; i < num_tiles; i++) {
      this._updateTileValue(i);
    }

  }

  private _swapTiles(one: number, two: number): void {
    const temp = this.tiles[one];
    this.tiles[one] = this.tiles[two];
    this.tiles[two] = temp;
  }

  private _updateTileValue(index: number): void {
    const tile = this.tiles[index];
    if (tile.isBomb()) {
      return;
    }
    let adjacent_bombs = 0;
    for (let i of this.getAdjacentTiles(index)) {
      if (this.tiles[i].isBomb()) {
        adjacent_bombs++;
      }
    }
    tile.value = adjacent_bombs;
  }

  private _isInBounds(index: number): boolean;
  private _isInBounds(x: number, y: number): boolean;
  private _isInBounds(x: number, y?: number): boolean {
    if (y === undefined) {
      if (x >= 0 && x < this.tiles.length) {
        return true;
      }
      return false;
    }
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return true;
    }
    return false;
  }

  private _getIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  private _getCoordinates(index: number): number[] {
    return [index % this.width, index / this.width | 0];
  }
}

module Minesweeper {
  export enum State {
    PREGAME,
    RUNNING,
    WIN,
    LOSE,
  }
}

export default Minesweeper;
