/// <reference path='../../typings/tsd.d.ts'/>

class Tile {
  value: number;
  state: Tile.State;

  // 10/5/2015 and I still can't put enums as statics on classes because Typescript won't recognize classes as namespaces
  // static State = TileState;

  constructor(value?: number, state?: Tile.State) {
    this.value = value || 0;
    this.state = state || Tile.State.DEFAULT;
  }

  isBomb(): boolean {
    return this.value === -1;
  }

  toString(): string {
    return `Tile { value: ${this.value}, state: ${Tile.State[this.state]}}`;
  }
}

module Tile {
  export enum State {
    REVEALED,
    REVEALED_EXPLODED,
    MARKED,
    MARKED_INCORRECT,
    DEFAULT,
  }
}

export default Tile;
