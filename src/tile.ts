/// <reference path='../typings/tsd.d.ts'/>

import 'pixi.js';

class Tile extends PIXI.Sprite {

  static Textures: {[index: string]: PIXI.Texture} = {
    'default': PIXI.Texture.fromImage('textures/tile/default.png'),
  };

  constructor() {
    super(Tile.Textures['default']);

  }
}
// Tile.prototype.width = 16;
// Tile.prototype.height = 16;

export default Tile;
