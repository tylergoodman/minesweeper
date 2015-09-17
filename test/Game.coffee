should = require 'should'
Minesweeper = require('../src/Game').default

describe 'Game', ->
  describe '#getAdjacentTiles', ->
    it 'returns correct neighbors', ->
      ms = new Minesweeper 5, 5
      ms.should.be.an.instanceof Minesweeper;
