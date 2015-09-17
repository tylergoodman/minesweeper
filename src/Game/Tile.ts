/// <reference path='../../typings/tsd.d.ts'/>

enum TileState {
  REVEALED,
  MARKED,
  DEFAULT,
}

export default class Tile {
  value: number;
  state: TileState;

  static State = TileState;

  constructor(value?: number, state?: TileState) {
    this.value = value || 0;
    this.state = state || TileState.DEFAULT;
  }

  isBomb(): boolean {
    return this.value === -1;
  }

}
