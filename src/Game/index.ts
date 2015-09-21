/// <reference path='../../typings/tsd.d.ts'/>

import * as _ from 'lodash';
import Tile from './Tile';

enum GameState {
  PREGAME,
  RUNNING,
  POSTGAME,
}

export default class Minesweeper {

  width: number;
  height: number;
  mines: number;

  tiles: Tile[];

  time: number;
  state: GameState;

  private _revealed_tiles: number;
  private _first_turn: boolean;

  static Tile = Tile;
  static State = GameState;

  constructor(width?: number, height?: number, mines?: number) {
    this.width = width || 16;
    this.height = height || 30;
    this.mines = mines || Math.round(this.width * this.height * (0.00020822 * this.width * this.height + 0.10528));

    this.tiles = this.generateBoard();
    this.state = Minesweeper.State.PREGAME;
    this.time = -1;

    this._revealed_tiles = 0;
    this._first_turn = true;
  }

  // TODO - change this to 'restart' if we're already State.RUNNING
  start(): void {
    this.state = Minesweeper.State.RUNNING;
    this.time = Date.now();
  }

  isOver(): boolean {
    return (this.width * this.height - this._revealed_tiles) === this.mines;
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
    if (tile.state === Tile.State.MARKED) {
      tile.state = Tile.State.DEFAULT
    }
    else {
      tile.state = Tile.State.MARKED;
    }
    return this;
  }

  revealTile(index: number): Minesweeper;
  revealTile(x: number, y: number): Minesweeper;
  revealTile(x: number, y?: number): Minesweeper {
    let index;
    if (y === undefined) {
      index = x;
    }
    else {
      index = this._getIndex(x, y);
    }
    let tile = this.tiles[index];

    if (this._first_turn && tile.isBomb()) {
      // find index of first not-bomb
      let first_safe_tile_index = -1;
      for (let i = 0, len = this.tiles.length; i < len; i++) {
        if (!this.tiles[i].isBomb()) {
          first_safe_tile_index = i;
          break;
        }
      }
      // if we have a safe tile (and we're not all bombs), swap tiles
      if (first_safe_tile_index !== -1) {
        const temp = this.tiles[first_safe_tile_index];
        this.tiles[first_safe_tile_index] = tile;
        tile = this.tiles[index] = temp;
      }
    }

    tile.state = Tile.State.REVEALED;
    return this;
  }

  // TODO - optimize this somehow
  getAdjacentTiles(index: number): number[] {
    const adjacent_tiles = [];
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    const [x, y] = this._getCoordinates(index);
    for (let direction of directions) {
      const [
        direction_x,
        direction_y,
      ] = direction;
      const neighbor_x = x + direction_x;
      const neighbor_y = y + direction_y;
      if (this._isInBounds(neighbor_x, neighbor_y)) {
        adjacent_tiles.push(neighbor_x * this.width + neighbor_y);
      }
    }
    return adjacent_tiles;
  }

  generateBoard(): Tile[] {
    const num_tiles = this.width * this.height;

    const tiles = _.chain<Tile>(new Array(this.width * this.height))
      .map((n, i) => {
        if (i < this.mines) {
          return new Tile(-1);
        }
        return new Tile;
      })
      .shuffle()
      .each((tile, i, tiles) => {
        if (tile.isBomb()) {
          return;
        }
        let adjacent_bombs = 0;
        for (let index of this.getAdjacentTiles(i)) {
          if (tiles[index].isBomb()) {
            adjacent_bombs++;
          }
        }
        tile.value = adjacent_bombs;
      })
      .value();

    return tiles;
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
    return x * this.width + y;
  }

  private _getCoordinates(index: number): number[] {
    return [index / this.width | 0, index % this.width];
  }
}
