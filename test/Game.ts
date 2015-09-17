/// <reference path='../../typings/tsd.d.ts'/>

import 'should';
import Minesweeper from '../src/Game/index';

describe('#getAdjacentTiles', () => {
  it('returns correct neighbors', () => {
    const ms = new Minesweeper(5, 5);
    ms.should.be.an.instanceof(Minesweeper);
    console.log(ms);
  });
});
