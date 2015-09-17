/// <reference path='../../typings/tsd.d.ts'/>

import * as _ from 'lodash';
import Tile from './Tile';

export default class Minesweeper {

  width: number;
  height: number;
  mines: number;

  tiles: Tile[];

  static Tile = Tile;

  constructor(width?: number, height?: number, mines?: number) {
    this.width = width || 16;
    this.height = height || 30;
    this.mines = mines || this.width * this.height * 0.2 | 0;

    this.tiles = this.generateBoard();
  }

  getAdjacentTiles(index: number): number[] {
    const adjacent_tiles = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const x = index / this.width | 0;
    const y = index % this.width;
    for (let direction of directions) {
      const [
        direction_x,
        direction_y,
      ] = direction;
      const neighbor_x = x + direction_x;
      const neighbor_y = y + direction_y;
      const neighbor_index = neighbor_x * this.width + neighbor_y % 16;
      if (neighbor_index >= 0 && neighbor_index < this.width * this.height) {
        adjacent_tiles.push(neighbor_index);
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
        return new Tile(0);
      })
      .shuffle()
      .each((tile, i, tiles) => {
        let adjacent_bombs = 0;
        for (let index of this.getAdjacentTiles(i)) {
          if (tiles[i].isBomb()) {
            adjacent_bombs++;
          }
        }
        tile.value = adjacent_bombs;
        return tile;
      })
      .value();

    return tiles;
  }
}
